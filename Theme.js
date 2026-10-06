// Night mode: 6pm to 6am on the viewer's own device clock.
// To change the hours, edit the two numbers below (24-hour clock).
const NIGHT_STARTS = 18; // 6pm
const NIGHT_ENDS = 6;    // 6am

function applyTheme() {
  const hour = new Date().getHours();
  const isNight = hour >= NIGHT_STARTS || hour < NIGHT_ENDS;
  document.documentElement.setAttribute("data-theme", isNight ? "night" : "day");
}

applyTheme();                       // runs immediately, so the page never flashes the wrong theme
setInterval(applyTheme, 60 * 1000); 