const JSONBLOB_API = "https://jsonblob.com/api/jsonBlob";

export function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
}

export function encodeJudgmentToUrl(judgment) {
  if (!judgment) return "";
  try {
    const minified = {
      n: judgment.name,
      s: judgment.status,
      q: judgment.voiceQuote,
      e: judgment.entropy,
      w: judgment.divineWill,
      f: judgment.fCategory,
      p: judgment.voicePitch,
      r: judgment.voiceRate,
      d: judgment.creationDate,
    };
    return encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(minified)))));
  } catch (e) {
    console.warn("Could not encode judgment to URL payload:", e);
    return "";
  }
}

export function decodeJudgmentFromUrl(encodedStr, id) {
  if (!encodedStr) return null;
  try {
    const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encodedStr))));
    const m = JSON.parse(jsonStr);
    return {
      id: id || "decreto_url",
      name: m.n || "Mortal",
      status: m.s || "prohibido",
      voiceQuote: m.q || "",
      entropy: m.e || 9999,
      divineWill: m.w || "0",
      fCategory: m.f || 1,
      voicePitch: m.p || 0.45,
      voiceRate: m.r || 0.8,
      creationDate: m.d || new Date().toISOString(),
      appeal: "",
      appealSubmitted: false,
    };
  } catch (e) {
    console.warn("Could not decode judgment from URL payload:", e);
    return null;
  }
}

function getLocalMap() {
  if (typeof localStorage === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("romel_judgments") || "{}");
  } catch (err) {
    return {};
  }
}

function setLocalMap(map) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem("romel_judgments", JSON.stringify(map));
  } catch (err) {
    console.warn("Could not write to localStorage:", err);
  }
}

function updateLocalCache(judgment) {
  if (!judgment || !judgment.id) return;
  const localJudgments = getLocalMap();
  localJudgments[judgment.id] = judgment;
  setLocalMap(localJudgments);
}

export async function saveJudgment(judgment) {
  let savedJudgment = { ...judgment };
  // Check if judgment ID is a local temporary ID or nonexistent
  const isNew = !savedJudgment.id || savedJudgment.id.length > 20 || savedJudgment.id.includes("-");

  try {
    // If it's an existing cloud ID (not new/temp), attempt PUT update
    if (!isNew) {
      const putRes = await fetch(`${JSONBLOB_API}/${savedJudgment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(savedJudgment),
      });

      if (putRes.ok) {
        updateLocalCache(savedJudgment);
        return savedJudgment;
      }
    }

    // Otherwise POST to create new cloud blob
    const payload = { ...savedJudgment };
    if (isNew) delete payload.id;

    const postRes = await fetch(JSONBLOB_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (postRes.ok) {
      const cloudBlobId =
        postRes.headers.get("x-jsonblob-id") ||
        postRes.headers.get("X-jsonblob-id") ||
        (postRes.headers.get("location") || "").split("/").pop() ||
        (postRes.headers.get("Location") || "").split("/").pop();

      if (cloudBlobId) {
        savedJudgment.id = cloudBlobId;
        // Perform PUT to attach final ID to blob
        await fetch(`${JSONBLOB_API}/${cloudBlobId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(savedJudgment),
        });
      }
    } else {
      console.warn("Cloud storage sync returned status:", postRes.status);
    }
  } catch (error) {
    console.error("Cloud storage sync failed, fallback to local storage:", error);
  }

  updateLocalCache(savedJudgment);
  return savedJudgment;
}

export async function getJudgment(id, fallbackEncoded = null) {
  let urlDecoded = decodeJudgmentFromUrl(fallbackEncoded, id);

  if (!id) return urlDecoded;

  try {
    const response = await fetch(`${JSONBLOB_API}/${id}`, {
      headers: {
        "Accept": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      updateLocalCache(data);
      return data;
    }
  } catch (error) {
    console.error("Cloud fetch failed:", error);
  }

  const localJudgments = getLocalMap();
  return localJudgments[id] || urlDecoded || null;
}

export async function getAllLocalJudgments() {
  const localJudgmentsMap = getLocalMap();
  const judgments = Object.values(localJudgmentsMap);

  const updatedJudgments = await Promise.all(
    judgments.map(async (j) => {
      if (!j.id) return j;
      try {
        const response = await fetch(`${JSONBLOB_API}/${j.id}`, {
          headers: { "Accept": "application/json" },
        });
        if (response.ok) {
          const freshData = await response.json();
          localJudgmentsMap[j.id] = freshData;
          return freshData;
        }
      } catch (err) {
        // keep local copy
      }
      return j;
    })
  );

  setLocalMap(localJudgmentsMap);

  return updatedJudgments.sort(
    (a, b) => new Date(b.creationDate || 0) - new Date(a.creationDate || 0)
  );
}

export async function deleteJudgment(id) {
  if (!id) return;
  const localJudgments = getLocalMap();
  delete localJudgments[id];
  setLocalMap(localJudgments);

  try {
    await fetch(`${JSONBLOB_API}/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Cloud delete failed:", error);
  }
}

export async function markJudgmentAsSeen(id) {
  if (!id) return null;
  try {
    const judgment = await getJudgment(id);
    if (!judgment) return null;

    const wasSeenBefore = Boolean(judgment.seen);
    const updated = {
      ...judgment,
      seen: true,
      seenAt: judgment.seenAt || new Date().toISOString(),
      viewCount: (judgment.viewCount || 0) + 1,
      lastViewedAt: new Date().toISOString(),
    };

    await saveJudgment(updated);
    return { judgment: updated, isFirstTime: !wasSeenBefore };
  } catch (error) {
    console.error("Could not mark judgment as seen:", error);
    return null;
  }
}
