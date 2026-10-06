// =====================================================
// LIST TO ADD, REMOVE, OR REORDER LETTERS
// =====================================================
const letters = [
  {
    name: "First Letter",
    date: "Oct 4, 2026",
    icon: "Letter.png",
    pages: ["Letter1_Page1.png", "Letter1_Page2.png", "Letter1_Page3.png", "Letter1_Page4.png"],
  },
  {
    name: "???",
    date: "Oct 9th, 2026",
    icon: "Letter.png",
    pages: [],
  }
  // To add another letter, copy the block above, paste it here, and edit it:
  // {
  //   name: "Anniversary",
  //   date: "Nov 12, 2026",
  //   icon: "Letter.png",
  //   pages: ["Anniversary_1.png"],
  // },
];
// =====================================================

const lettersEl = document.getElementById("letters");
const popupsEl = document.getElementById("popups");
const overlay = document.getElementById("overlay");

// Build a button + popup for every letter in the list
letters.forEach((letter, index) => {
  const popupId = "popup" + index;

  // Clickable letter with its name and date ---
  const card = document.createElement("div");
  card.className = "letter";

  const button = document.createElement("button");
  button.className = "open-button";
  button.dataset.popupTarget = "#" + popupId;

  const icon = document.createElement("img");
  icon.src = letter.icon;
  icon.alt = "Open letter: " + letter.name;
  button.appendChild(icon);

  const label = document.createElement("p");
  label.className = "letter-label";
  label.textContent = letter.name;

  const date = document.createElement("p");
  date.className = "letter-date";
  date.textContent = letter.date;

  card.append(button, label, date);
  lettersEl.appendChild(card);

  // --- the popup that opens ---
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.id = popupId;

  const header = document.createElement("div");
  header.className = "popup-header";

  const title = document.createElement("div");
  title.className = "title";
  title.textContent = letter.name;

  const close = document.createElement("button");
  close.className = "close-button";
  close.dataset.closeButton = "";
  close.innerHTML = "&times;";

  header.append(title, close);

  const body = document.createElement("div");
  body.className = "popup-body";
  letter.pages.forEach((src, i) => {
    const page = document.createElement("img");
    page.src = src;
    page.alt = letter.name + " - page " + (i + 1);
    body.appendChild(page);
  });

  popup.append(header, body);
  popupsEl.appendChild(popup);
});

// --- open / close ---
function openPopup(popup) {
  if (!popup) return;
  popup.classList.add("active");
  overlay.classList.add("active");
}

function closePopup(popup) {
  if (!popup) return;
  popup.classList.remove("active");
  overlay.classList.remove("active");
}

function closeAllPopups() {
  document.querySelectorAll(".popup.active").forEach(closePopup);
}

// One click listener handles every button, including ones added later
document.addEventListener("click", (e) => {
  const opener = e.target.closest("[data-popup-target]");
  if (opener) {
    openPopup(document.querySelector(opener.dataset.popupTarget));
    return;
  }

  const closer = e.target.closest("[data-close-button]");
  if (closer) {
    closePopup(closer.closest(".popup"));
    return;
  }

  if (e.target === overlay) closeAllPopups();
});

// Escape key closes the popup too
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllPopups();
});

// --- drag a popup by its header ---
let startX = 0, startY = 0;

document.addEventListener("mousedown", (e) => {
  const header = e.target.closest(".popup-header");
  if (!header || e.target.closest("[data-close-button]")) return;

  const card = header.closest(".popup");
  startX = e.clientX;
  startY = e.clientY;

  function mouseMove(e) {
    card.style.left = (card.offsetLeft - (startX - e.clientX)) + "px";
    card.style.top = (card.offsetTop - (startY - e.clientY)) + "px";
    startX = e.clientX;
    startY = e.clientY;
  }
  function mouseUp() {
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
  }
  document.addEventListener("mousemove", mouseMove);
  document.addEventListener("mouseup", mouseUp);
});