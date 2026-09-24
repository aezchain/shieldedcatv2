const clock = document.getElementById("clock");
const petSpeech = document.getElementById("petSpeech");
const catButton = document.getElementById("catButton");
const stealthBar = document.getElementById("stealthBar");
const stealthPercent = document.getElementById("stealthPercent");
const mood = document.getElementById("mood");
const feedButton = document.getElementById("feedButton");
const copyButton = document.getElementById("copyContract");
const contractAddress = document.getElementById("contractAddress").textContent;
const toast = document.getElementById("toast");
let treatCount = 0;
let stealth = 0;
let radioContext;
let radioTimer;
let radioStep = 0;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(
    () => toast.classList.remove("is-visible"),
    2100,
  );
}

function updateClock() {
  clock.textContent = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}
updateClock();
window.setInterval(updateClock, 30000);

function playMeow() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const context = new AudioContext();
  const voice = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;
  voice.type = "triangle";
  voice.frequency.setValueAtTime(720, now);
  voice.frequency.exponentialRampToValueAtTime(420, now + 0.18);
  voice.frequency.exponentialRampToValueAtTime(610, now + 0.37);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.14, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
  voice.connect(gain);
  gain.connect(context.destination);
  voice.start(now);
  voice.stop(now + 0.43);
  window.setTimeout(() => context.close(), 550);
}

function stopRadio() {
  window.clearInterval(radioTimer);
  radioTimer = undefined;
}

function playRadioNote() {
  if (!radioContext) return;
  const notes = [262, 330, 392, 523, 392, 330, 294, 392];
  const oscillator = radioContext.createOscillator();
  const gain = radioContext.createGain();
  const now = radioContext.currentTime;
  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(notes[radioStep % notes.length], now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.045, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  oscillator.connect(gain);
  gain.connect(radioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.17);
  radioStep += 1;
}

function startRadio() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  if (!radioContext) radioContext = new AudioContext();
  if (radioContext.state === "suspended") radioContext.resume();
  stopRadio();
  playRadioNote();
  radioTimer = window.setInterval(playRadioNote, 215);
}

const catLines = [
  "MROW!",
  "NO SNITCHES.",
  "LASER GOOD.",
  "I AM SHY.",
  "PURR-VACY!",
];
catButton.addEventListener("click", () => {
  playMeow();
  petSpeech.innerHTML = catLines[
    Math.floor(Math.random() * catLines.length)
  ].replace(" ", "<br />");
  catButton.classList.remove("is-meowing");
  void catButton.offsetWidth;
  catButton.classList.add("is-meowing");
  window.setTimeout(() => catButton.classList.remove("is-meowing"), 650);
});

feedButton.addEventListener("click", () => {
  treatCount += 1;
  stealth = Math.min(100, stealth + 20);
  stealthBar.style.width = stealth + "%";
  stealthPercent.textContent = stealth + "%";
  mood.textContent = treatCount === 1 ? "snack mode" : "treat x" + treatCount;
  feedButton.textContent = "ANOTHER TREAT? x" + treatCount;
  petSpeech.innerHTML =
    treatCount % 2 ? "BEST DAY<br />EVER." : "MORE FISH<br />PLEASE.";
  showToast("TREAT DEPLOYED. CAT HAPPINESS +" + treatCount);
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(contractAddress);
    copyButton.textContent = "COPIED. MEOW.";
    window.setTimeout(() => {
      copyButton.textContent = "COPY CONTRACT ⧉";
    }, 1800);
  } catch {
    copyButton.textContent = "SELECT CONTRACT";
  }
});

document.querySelectorAll("[data-open]").forEach((icon) => {
  icon.addEventListener("click", () => {
    const app = document.getElementById(icon.dataset.open);
    app.hidden = false;
    app.style.zIndex = "18";
    if (icon.dataset.open === "radio") startRadio();
    showToast(icon.dataset.open.toUpperCase() + " OPENED");
  });
});
document.querySelectorAll("[data-close]").forEach((close) => {
  close.addEventListener("click", () => {
    document.getElementById(close.dataset.close).hidden = true;
    if (close.dataset.close === "radio") stopRadio();
  });
});
document.querySelectorAll("[data-route]").forEach((stop) => {
  stop.addEventListener("click", () => {
    document.getElementById("routeMessage").textContent = stop.dataset.route;
  });
});

document.querySelectorAll("[data-station]").forEach((station) => {
  station.addEventListener("click", () => {
    document.getElementById("radioTitle").textContent = station.dataset.station;
    startRadio();
    showToast("TUNED TO " + station.dataset.station);
  });
});

document.getElementById("replyButton").addEventListener("click", () => {
  document.getElementById("replyButton").textContent = "SENT: MEOW. ✓";
  showToast("PAW MAIL SENT TO MOM");
});

document.querySelectorAll(".window").forEach((windowElement) => {
  const bar = windowElement.querySelector(".window-bar");
  let startX = 0;
  let startY = 0;
  let originX = 0;
  let originY = 0;

  bar.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button") || window.innerWidth <= 640) return;
    const box = windowElement.getBoundingClientRect();
    startX = event.clientX;
    startY = event.clientY;
    originX = box.left;
    originY = box.top;
    windowElement.style.left = originX + "px";
    windowElement.style.top = originY + "px";
    windowElement.style.right = "auto";
    windowElement.style.bottom = "auto";
    windowElement.style.transform = "none";
    windowElement.classList.add("is-dragging");
    windowElement.style.zIndex = "19";
    bar.setPointerCapture(event.pointerId);
  });

  bar.addEventListener("pointermove", (event) => {
    if (!windowElement.classList.contains("is-dragging")) return;
    windowElement.style.left = originX + event.clientX - startX + "px";
    windowElement.style.top = originY + event.clientY - startY + "px";
  });

  bar.addEventListener("pointerup", () =>
    windowElement.classList.remove("is-dragging"),
  );
  bar.addEventListener("pointercancel", () =>
    windowElement.classList.remove("is-dragging"),
  );
});

let lastTrail = 0;
window.addEventListener("pointermove", (event) => {
  if (event.pointerType !== "mouse" || event.timeStamp - lastTrail < 145)
    return;
  lastTrail = event.timeStamp;
  const star = document.createElement("span");
  star.className = "paw";
  star.textContent = "✦";
  star.style.left = event.clientX + "px";
  star.style.top = event.clientY + "px";
  star.style.setProperty("--turn", -25 + Math.random() * 50 + "deg");
  document.body.appendChild(star);
  window.setTimeout(() => star.remove(), 800);
});
