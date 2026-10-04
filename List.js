const firebaseConfig = {
  apiKey: "AIzaSyCI9Ud_A8QdJXXdykq4V10XIy3QG1TrB3s",
  authDomain: "sleeporawake-ba893.firebaseapp.com",
  projectId: "sleeporawake-ba893",
  storageBucket: "sleeporawake-ba893.firebasestorage.app",
  messagingSenderId: "21740641524",
  appId: "1:21740641524:web:bfc94b691e9d491fbad2a1",
};

firebase.initializeApp(firebaseConfig);

// Uses the "list/shared" spot in the database, which your rules already allow
const noteDoc = firebase.firestore().collection("list").doc("shared");

const box = document.getElementById("note");
const statusEl = document.getElementById("status");

let dirty = false; // true while you have changes that aren't saved yet
let saveTimer;

// Runs on load AND whenever the other person changes the note
noteDoc.onSnapshot(
  (snap) => {
    if (snap.metadata.hasPendingWrites) return;          // ignore our own save echoing back
    if (!snap.exists && snap.metadata.fromCache) return; // wait for the real data

    const remote = snap.exists ? snap.data().text || "" : "";

    // don't overwrite what you're in the middle of typing
    if (!dirty && box.value !== remote) {
      const start = box.selectionStart;
      const end = box.selectionEnd;
      box.value = remote;
      box.setSelectionRange(start, end);
    }

    box.disabled = false;
    if (!dirty) statusEl.textContent = "Saved";
  },
  (error) => {
    console.error("Firebase error:", error);
    statusEl.textContent = "Couldn't connect. Try refreshing.";
  }
);

// Auto-save shortly after you stop typing
box.addEventListener("input", () => {
  dirty = true;
  statusEl.textContent = "Typing...";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, 700);
});

function save() {
  clearTimeout(saveTimer);
  const sent = box.value;
  statusEl.textContent = "Saving...";
  noteDoc
    .set({ text: sent })
    .then(() => {
      if (box.value === sent) {
        dirty = false;
        statusEl.textContent = "Saved";
      }
    })
    .catch((error) => {
      console.error(error);
      statusEl.textContent = "Couldn't save. Check your connection.";
    });
}

// Save right away if you switch apps or close the tab (important on phones)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && dirty) save();
});