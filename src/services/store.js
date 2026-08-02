// Service for saving and loading judgments.
// Uses a public kvdb.io bucket for zero-config cloud synchronization,
// with a robust LocalStorage fallback for offline testing.

const BUCKET_ID = "kvd_romel_prohibido_v1";
const BASE_URL = `https://kvdb.io/${BUCKET_ID}`;

// Helper to generate a random ID
export function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

// Save a judgment
export async function saveJudgment(judgment) {
  // Always save to localStorage first
  const localJudgments = JSON.parse(localStorage.getItem("romel_judgments") || "{}");
  localJudgments[judgment.id] = judgment;
  localStorage.setItem("romel_judgments", JSON.stringify(localJudgments));

  // Sync to Cloud KV DB
  try {
    const response = await fetch(`${BASE_URL}/${judgment.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(judgment),
    });
    if (!response.ok) {
      console.warn("Failed to sync judgment to cloud storage. Response status:", response.status);
    }
  } catch (error) {
    console.error("Cloud storage sync failed, using localStorage fallback:", error);
  }

  return judgment;
}

// Get a judgment by ID
export async function getJudgment(id) {
  // First, check the Cloud KV DB
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (response.ok) {
      const data = await response.json();
      // Update local storage cache
      const localJudgments = JSON.parse(localStorage.getItem("romel_judgments") || "{}");
      localJudgments[id] = data;
      localStorage.setItem("romel_judgments", JSON.stringify(localJudgments));
      return data;
    }
  } catch (error) {
    console.error("Could not fetch from cloud, reading from local cache:", error);
  }

  // Fallback to localStorage
  const localJudgments = JSON.parse(localStorage.getItem("romel_judgments") || "{}");
  return localJudgments[id] || null;
}

// Get all judgments created locally by Romel
export async function getAllLocalJudgments() {
  const localJudgmentsMap = JSON.parse(localStorage.getItem("romel_judgments") || "{}");
  const judgments = Object.values(localJudgmentsMap);

  // Attempt to update all of them from the cloud in background
  const updatedJudgments = await Promise.all(
    judgments.map(async (j) => {
      try {
        const response = await fetch(`${BASE_URL}/${j.id}`);
        if (response.ok) {
          const freshData = await response.json();
          localJudgmentsMap[j.id] = freshData;
          return freshData;
        }
      } catch (e) {
        // Ignore individual sync errors
      }
      return j;
    })
  );

  localStorage.setItem("romel_judgments", JSON.stringify(localJudgmentsMap));
  
  // Sort by date descending
  return updatedJudgments.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
}
