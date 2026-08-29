const rateInput = document.getElementById("returnRate");
const drawBtn = document.getElementById("drawBtn");
const reDrawBtn = document.getElementById("reDrawBtn");
const resultCard = document.getElementById("resultCard");
const resultRange = document.getElementById("resultRange");
const resultEmoji = document.getElementById("resultEmoji");
const resultMenu = document.getElementById("resultMenu");
const resultComment = document.getElementById("resultComment");
const errorMsg = document.getElementById("errorMsg");

function renderResult(rate) {
  const result = pickLunch(rate);
  resultRange.textContent = `수익률 ${result.label}`;
  resultEmoji.textContent = result.emoji;
  resultMenu.textContent = result.menu;
  resultComment.textContent = result.comment;
  resultCard.classList.remove("hidden");
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
  renderResult(rate);
}

function handleReDraw() {
  const rate = Number(rateInput.value);
  renderResult(rate);
}

drawBtn.addEventListener("click", handleDraw);
reDrawBtn.addEventListener("click", handleReDraw);
rateInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleDraw();
});
