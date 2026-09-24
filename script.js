const clock = document.getElementById("clock");
const petSpeech = document.getElementById("petSpeech");
const catButton = document.getElementById("catButton");
const stealthBar = document.getElementById("stealthBar");
const stealthPercent = document.getElementById("stealthPercent");
const mood = document.getElementById("mood");
const feedButton = document.getElementById("feedButton");
const copyButton = document.getElementById("copyContract");
const contractAddress = document.getElementById("contractAddress").textContent;

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
  stealthBar.style.width = "100%";
  stealthPercent.textContent = "100%";
  mood.textContent = "snack secured";
  feedButton.textContent = "PURR. STEALTH MAXED.";
  petSpeech.innerHTML = "BEST DAY<br />EVER.";
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
    document.getElementById(icon.dataset.open).hidden = false;
  });
});
document.querySelectorAll("[data-close]").forEach((close) => {
  close.addEventListener("click", () => {
    document.getElementById(close.dataset.close).hidden = true;
  });
});
document.querySelectorAll("[data-route]").forEach((stop) => {
  stop.addEventListener("click", () => {
    document.getElementById("routeMessage").textContent = stop.dataset.route;
  });
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
