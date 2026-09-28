let startX = 0, startY = 0;
const overlay = document.getElementById('overlay');

// open
document.querySelectorAll('[data-popup-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    openPopup(document.querySelector(btn.dataset.popupTarget));
  });
});

// close
document.querySelectorAll('[data-close-button]').forEach(btn => {
  btn.addEventListener('click', () => closePopup(btn.closest('.popup')));
});
overlay.addEventListener('click', () => {
  document.querySelectorAll('.popup.active').forEach(closePopup);
});

function openPopup(popup) {
  if (!popup) return;
  popup.classList.add('active');
  overlay.classList.add('active');
}
function closePopup(popup) {
  if (!popup) return;
  popup.classList.remove('active');
  overlay.classList.remove('active');
}

// drag by header
document.querySelectorAll('.popup-header').forEach(h => h.addEventListener('mousedown', mouseDown));

function mouseDown(e) {
  const card = e.currentTarget.closest('.popup');
  startX = e.clientX;
  startY = e.clientY;

  function mouseMove(e) {
    card.style.left = (card.offsetLeft - (startX - e.clientX)) + 'px';
    card.style.top  = (card.offsetTop  - (startY - e.clientY)) + 'px';
    startX = e.clientX;
    startY = e.clientY;
  }
  function mouseUp() {
    document.removeEventListener('mousemove', mouseMove);
    document.removeEventListener('mouseup', mouseUp);
  }
  document.addEventListener('mousemove', mouseMove);
  document.addEventListener('mouseup', mouseUp);
}