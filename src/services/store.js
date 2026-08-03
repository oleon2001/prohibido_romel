const JSONBLOB_API = "https://jsonblob.com/api/jsonBlob";

export function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11);
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

  try {
    // If judgment has an id, attempt updating (PUT) first
    if (savedJudgment.id) {
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

    // If PUT fails or if it's a brand new judgment without cloud blob, create via POST
    const postRes = await fetch(JSONBLOB_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(savedJudgment),
    });

    if (postRes.ok) {
      const location = postRes.headers.get("location") || postRes.headers.get("Location");
      if (location) {
        const cloudBlobId = location.split("/").pop();
        savedJudgment.id = cloudBlobId;
      }
    } else {
      console.warn("Failed to sync judgment to cloud storage. Status:", postRes.status);
    }
  } catch (error) {
    console.error("Cloud storage sync failed, using localStorage fallback:", error);
  }

  updateLocalCache(savedJudgment);
  return savedJudgment;
}

export async function getJudgment(id) {
  if (!id) return null;

  try {
    const response = await fetch(`${JSONBLOB_API}/${id}`, {
      headers: {
        "Accept": "application/json"
      }
    });
    if (response.ok) {
      const data = await response.json();
      updateLocalCache(data);
      return data;
    }
  } catch (error) {
    console.error("Could not fetch from cloud, reading from local cache:", error);
  }

  const localJudgments = getLocalMap();
  return localJudgments[id] || null;
}

export async function getAllLocalJudgments() {
  const localJudgmentsMap = getLocalMap();
  const judgments = Object.values(localJudgmentsMap);

  const updatedJudgments = await Promise.all(
    judgments.map(async (j) => {
      if (!j.id) return j;
      try {
        const response = await fetch(`${JSONBLOB_API}/${j.id}`, {
          headers: { "Accept": "application/json" }
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

  return updatedJudgments.sort((a, b) => new Date(b.creationDate || 0) - new Date(a.creationDate || 0));
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

