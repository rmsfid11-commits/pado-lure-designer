// 카드 한 장 + 컨페티 "짠!" 연출을 담당하는 공통 결과 오버레이.
// 룰렛, 30초 결정처럼 "하나를 뽑아서 보여주는" 기능이면 어디서든 재사용.

const SHUFFLE_DURATION = 500;
const SHUFFLE_TICK = 55;
const AFTER_REVEAL_DELAY = 900;
const CONFETTI_COLORS = ["#3182f6", "#f04452", "#ffb84d", "#4caf82", "#8b5cf6"];
const TONES = ["tone-gain", "tone-neutral", "tone-loss"];

let overlay, resultCard, confettiLayer, resultEmoji, resultLine1, resultLine2, resultComment, resultAfter, redrawBtn, closeBtn;
let currentOnRedraw = null;
let currentShuffleNames = [];
let afterRevealTimer = null;

function spawnConfetti() {
  confettiLayer.innerHTML = "";
  const pieceCount = 26;

  for (let i = 0; i < pieceCount; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const angle = Math.random() * Math.PI + Math.PI; // 위쪽 반원으로 퍼짐
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
  if (tone) resultCard.classList.add(`tone-${tone}`);
}

function renderFinal({ emoji, line1, line2, comment, tone, after }) {
  resultEmoji.textContent = emoji ?? "";
  resultLine1.textContent = line1 ?? "";
  resultLine2.textContent = line2 ?? "";
  resultComment.textContent = comment ?? "";
  applyTone(tone);

  resultCard.classList.remove("settled");
  void resultCard.offsetWidth;
  resultCard.classList.add("settled");
  spawnConfetti();

  if (navigator.vibrate) navigator.vibrate(20);

  clearTimeout(afterRevealTimer);
  resultAfter.classList.add("hidden");
  resultAfter.classList.remove("shown");
  resultAfter.textContent = "";
  if (after) {
    afterRevealTimer = setTimeout(() => {
      resultAfter.textContent = `+ ${after.emoji} ${after.name} — ${after.reason}`;
      resultAfter.classList.remove("hidden");
      requestAnimationFrame(() => resultAfter.classList.add("shown"));
    }, AFTER_REVEAL_DELAY);
  }
}

/**
 * @param {Object} config
 * @param {() => {emoji, line1, line2, comment, tone, after?}} config.pick - 결과를 뽑는 함수 (다시 뽑기 때 재호출됨).
 *   after는 선택 항목: {emoji, name, reason} 형태로 주면 카드가 착지한 뒤 살짝 늦게 곁들임 추천이 따라붙는다.
 * @param {string[]} [config.shuffleNames] - 슬롯 연출 중 무작위로 보여줄 후보 이름들
 */
export function showReveal({ pick, shuffleNames = [] }) {
  currentOnRedraw = pick;
  currentShuffleNames = shuffleNames;

  redrawBtn.disabled = true;
  overlay.classList.remove("hidden");
  resultCard.classList.add("shuffling");
  resultLine1.textContent = "결과를 뽑는 중...";
  resultLine2.textContent = "";
  resultComment.textContent = "";
  resultEmoji.textContent = "🎲";
  clearTimeout(afterRevealTimer);
  resultAfter.classList.add("hidden");
  resultAfter.classList.remove("shown");

  const shuffleTimer =
    currentShuffleNames.length > 0
      ? setInterval(() => {
          resultLine2.textContent =
            currentShuffleNames[Math.floor(Math.random() * currentShuffleNames.length)];
        }, SHUFFLE_TICK)
      : null;

  setTimeout(() => {
    if (shuffleTimer) clearInterval(shuffleTimer);
    resultCard.classList.remove("shuffling");
    renderFinal(pick());
    redrawBtn.disabled = false;
  }, SHUFFLE_DURATION);
}

function handleRedraw() {
  if (!currentOnRedraw) return;
  showReveal({ pick: currentOnRedraw, shuffleNames: currentShuffleNames });
}

function closeOverlay() {
  overlay.classList.add("hidden");
  confettiLayer.innerHTML = "";
  currentOnRedraw = null;
  clearTimeout(afterRevealTimer);
}

export function initRevealOverlay() {
  overlay = document.getElementById("resultOverlay");
  resultCard = document.getElementById("resultCard");
  confettiLayer = document.getElementById("confettiLayer");
  resultEmoji = document.getElementById("resultEmoji");
  resultLine1 = document.getElementById("resultLine1");
  resultLine2 = document.getElementById("resultLine2");
  resultComment = document.getElementById("resultComment");
  resultAfter = document.getElementById("resultAfter");
  redrawBtn = document.getElementById("reDrawBtn");
  closeBtn = document.getElementById("closeOverlayBtn");

  redrawBtn.addEventListener("click", handleRedraw);
  closeBtn.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeOverlay();
  });
}
