const rateValue = document.getElementById("rateValue");
const rateDisplay = document.getElementById("rateDisplay");
const incBtn = document.getElementById("incBtn");
const decBtn = document.getElementById("decBtn");
const drawBtn = document.getElementById("drawBtn");
const reDrawBtn = document.getElementById("reDrawBtn");
const closeBtn = document.getElementById("closeBtn");

const overlay = document.getElementById("resultOverlay");
const resultCard = document.getElementById("resultCard");
const confettiLayer = document.getElementById("confettiLayer");
const resultEmoji = document.getElementById("resultEmoji");
const resultRate = document.getElementById("resultRate");
const resultMenu = document.getElementById("resultMenu");
const resultComment = document.getElementById("resultComment");

const SHUFFLE_DURATION = 500;
const SHUFFLE_TICK = 55;
const CONFETTI_COLORS = ["#3182f6", "#f04452", "#ffb84d", "#4caf82", "#8b5cf6"];
const TONES = ["tone-gain", "tone-neutral", "tone-loss"];

const RATE_MIN = -20;
const RATE_MAX = 20;
const RATE_STEP = 1;
const HOLD_REPEAT_DELAY = 400;
const HOLD_REPEAT_INTERVAL = 90;

let currentRate = 0;

function formatRate(rate) {
  const sign = rate > 0 ? "+" : "";
  return `${sign}${rate}%`;
}

function renderRate() {
  rateValue.textContent = currentRate > 0 ? `+${currentRate}` : `${currentRate}`;
}

function adjustRate(delta) {
  currentRate = Math.min(RATE_MAX, Math.max(RATE_MIN, currentRate + delta));
  renderRate();
}

const DRAG_PIXELS_PER_STEP = 14;

function bindDragScrub(el) {
  let dragging = false;
  let startY = 0;
  let startRate = 0;
  let lastSteps = 0;

  el.addEventListener("pointerdown", (e) => {
    dragging = true;
    startY = e.clientY;
    startRate = currentRate;
    lastSteps = 0;
    el.setPointerCapture(e.pointerId);
    el.classList.add("dragging");
  });

  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const deltaY = startY - e.clientY; // 위로 끌면 양수 -> 값 증가
    const steps = Math.round(deltaY / DRAG_PIXELS_PER_STEP);
    if (steps === lastSteps) return;
    lastSteps = steps;
    const nextRate = Math.min(RATE_MAX, Math.max(RATE_MIN, startRate + steps));
    if (nextRate !== currentRate) {
      currentRate = nextRate;
      renderRate();
      if (navigator.vibrate) navigator.vibrate(4);
    }
  });

  const endDrag = () => {
    dragging = false;
    el.classList.remove("dragging");
  };
  el.addEventListener("pointerup", endDrag);
  el.addEventListener("pointercancel", endDrag);
}

function bindStepperHold(button, delta) {
  let holdTimer = null;
  let repeatTimer = null;

  const stop = () => {
    clearTimeout(holdTimer);
    clearInterval(repeatTimer);
    holdTimer = null;
    repeatTimer = null;
  };

  button.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    adjustRate(delta);
    holdTimer = setTimeout(() => {
      repeatTimer = setInterval(() => adjustRate(delta), HOLD_REPEAT_INTERVAL);
    }, HOLD_REPEAT_DELAY);
  });

  ["pointerup", "pointerleave", "pointercancel"].forEach((evt) =>
    button.addEventListener(evt, stop)
  );
}

function spawnConfetti() {
  confettiLayer.innerHTML = "";
  const pieceCount = 26;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const angle = (Math.random() * Math.PI) + Math.PI; // 위쪽 반원으로 퍼짐
    const distance = 70 + Math.random() * 90;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    piece.style.setProperty("--x", `${x}px`);
    piece.style.setProperty("--y", `${y}px`);
    piece.style.setProperty("--rot", `${Math.random() * 720 - 360}deg`);
    piece.style.setProperty("--delay", `${Math.random() * 90}ms`);
    piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    confettiLayer.appendChild(piece);
  }
}

function applyTone(tone) {
  resultCard.classList.remove(...TONES);
  resultCard.classList.add(`tone-${tone}`);
}

function revealResult(rate) {
  const result = pickLunch(rate);
  resultEmoji.textContent = result.emoji;
  resultRate.textContent = `오늘은 ${formatRate(rate)}군요,`;
  resultMenu.textContent = `${result.menu}~`;
  resultComment.textContent = result.comment;
  applyTone(result.tone);

  resultCard.classList.remove("settled");
  void resultCard.offsetWidth;
  resultCard.classList.add("settled");
  spawnConfetti();

  if (navigator.vibrate) {
    navigator.vibrate(20);
  }
}

function shuffleThenReveal(rate) {
  drawBtn.disabled = true;
  reDrawBtn.disabled = true;
  overlay.classList.remove("hidden");
  resultCard.classList.add("shuffling");
  resultRate.textContent = "오늘의 점심을 뽑는 중...";
  resultMenu.textContent = "";
  resultComment.textContent = "";
  resultEmoji.textContent = "🎲";

  const shuffleTimer = setInterval(() => {
    resultMenu.textContent = ALL_MENU_NAMES[Math.floor(Math.random() * ALL_MENU_NAMES.length)];
  }, SHUFFLE_TICK);

  setTimeout(() => {
    clearInterval(shuffleTimer);
    resultCard.classList.remove("shuffling");
    revealResult(rate);
    drawBtn.disabled = false;
    reDrawBtn.disabled = false;
  }, SHUFFLE_DURATION);
}

function handleDraw() {
  shuffleThenReveal(currentRate);
}

function closeOverlay() {
  overlay.classList.add("hidden");
  confettiLayer.innerHTML = "";
}

renderRate();
bindStepperHold(incBtn, RATE_STEP);
bindStepperHold(decBtn, -RATE_STEP);
bindDragScrub(rateDisplay);

drawBtn.addEventListener("click", handleDraw);
reDrawBtn.addEventListener("click", handleDraw);
closeBtn.addEventListener("click", closeOverlay);
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeOverlay();
});
