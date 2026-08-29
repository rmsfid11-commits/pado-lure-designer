const rateInput = document.getElementById("returnRate");
const drawBtn = document.getElementById("drawBtn");
const reDrawBtn = document.getElementById("reDrawBtn");
const resultCard = document.getElementById("resultCard");
const resultRange = document.getElementById("resultRange");
const resultEmoji = document.getElementById("resultEmoji");
const resultMenu = document.getElementById("resultMenu");
const resultComment = document.getElementById("resultComment");
const errorMsg = document.getElementById("errorMsg");
const quickChips = document.getElementById("quickChips");

const SHUFFLE_DURATION = 650;
const SHUFFLE_TICK = 60;
const TONES = ["tone-gain", "tone-neutral", "tone-loss"];

function applyTone(tone) {
  resultCard.classList.remove(...TONES);
  resultCard.classList.add(`tone-${tone}`);
}

function revealResult(rate) {
  const result = pickLunch(rate);
  resultRange.textContent = `수익률 ${result.label}`;
  resultEmoji.textContent = result.emoji;
  resultMenu.textContent = result.menu;
  resultComment.textContent = result.comment;
  applyTone(result.tone);
  resultCard.classList.remove("settled");
  // 강제 리플로우로 착지 애니메이션을 매번 다시 재생시킴
  void resultCard.offsetWidth;
  resultCard.classList.add("settled");

  if (navigator.vibrate) {
    navigator.vibrate(20);
  }
}

function shuffleThenReveal(rate) {
  drawBtn.disabled = true;
  reDrawBtn.disabled = true;
  resultCard.classList.remove("hidden");
  resultCard.classList.add("shuffling");
  resultRange.textContent = "오늘의 점심을 뽑는 중...";

  const shuffleTimer = setInterval(() => {
    resultMenu.textContent = ALL_MENU_NAMES[Math.floor(Math.random() * ALL_MENU_NAMES.length)];
    resultEmoji.textContent = "🎲";
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
  const value = rateInput.value.trim();
  const rate = Number(value);

  if (value === "" || Number.isNaN(rate)) {
    errorMsg.classList.remove("hidden");
    resultCard.classList.add("hidden");
    return;
  }

  errorMsg.classList.add("hidden");
  shuffleThenReveal(rate);
}

drawBtn.addEventListener("click", handleDraw);
reDrawBtn.addEventListener("click", handleDraw);
rateInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleDraw();
});

quickChips.addEventListener("click", (e) => {
  const chip = e.target.closest(".chip");
  if (!chip) return;
  rateInput.value = chip.dataset.rate;
  handleDraw();
});
