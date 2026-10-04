const firebaseConfig = {
  apiKey: "AIzaSyCI9Ud_A8QdJXXdykq4V10XIy3QG1TrB3s",
  authDomain: "sleeporawake-ba893.firebaseapp.com",
  projectId: "sleeporawake-ba893",
  storageBucket: "sleeporawake-ba893.firebasestorage.app",
  messagingSenderId: "21740641524",
  appId: "1:21740641524:web:bfc94b691e9d491fbad2a1",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const listDoc = db.collection("list").doc("shared");

const form = document.getElementById("add-form");
const input = document.getElementById("new-item");
const itemsEl = document.getElementById("items");
const statusEl = document.getElementById("status");
const clearBtn = document.getElementById("clear-done");

let items = [];

// Runs on load AND whenever either of you changes the list
listDoc.onSnapshot(
  (snap) => {
    items = snap.exists ? snap.data().items || [] : [];
    render();
  },
  (error) => {
    console.error("Firebase error:", error);
    statusEl.textContent = "Couldn't connect to the list. Try refreshing.";
  }
);

// Safely changes the list: reads the newest version, applies the change, saves.
// This keeps two people's edits from overwriting each other.
function update(change) {
  return db
    .runTransaction(async (tx) => {
      const snap = await tx.get(listDoc);
      const current = snap.exists ? snap.data().items || [] : [];
      tx.set(listDoc, { items: change(current) });
    })
    .catch((error) => {
      console.error(error);
      alert("Couldn't save that. Check your connection and try again.");
    });
}

function render() {
  itemsEl.innerHTML = "";

  if (items.length === 0) {
    statusEl.textContent = "Nothing here yet. Add the first thing!";
  } else {
    statusEl.textContent = "";
  }

  items.forEach((item) => {
    const li = document.createElement("li");
    if (item.done) li.classList.add("done");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = item.done;
    checkbox.addEventListener("change", () => {
      update((list) =>
        list.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i))
      );
    });

    const text = document.createElement("span");
    text.textContent = item.text; // textContent keeps typed text safe

    const del = document.createElement("button");
    del.type = "button";
    del.className = "delete-btn";
    del.textContent = "\u00d7";
    del.setAttribute("aria-label", "Delete item");
    del.addEventListener("click", () => {
      update((list) => list.filter((i) => i.id !== item.id));
    });

    li.append(checkbox, text, del);
    itemsEl.appendChild(li);
  });

  clearBtn.style.display = items.some((i) => i.done) ? "block" : "none";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text === "") return;

  const newItem = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    text: text,
    done: false,
  };
  input.value = "";
  update((list) => [...list, newItem]);
});

clearBtn.addEventListener("click", () => {
  if (confirm("Remove all checked items?")) {
    update((list) => list.filter((i) => !i.done));
  }
});