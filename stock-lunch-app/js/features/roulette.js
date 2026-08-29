import { createNumberField } from "../numberField.js";
import { showReveal } from "../revealOverlay.js";
import { pickLunch, ALL_MENU_NAMES } from "./roulette.data.js";

export function initRoulette() {
  const root = document.getElementById("panel-roulette");
  const drawBtn = root.querySelector("[data-role='drawBtn']");

  const rateField = createNumberField({
    valueEl: root.querySelector("[data-role='rateValue']"),
    dragEl: root.querySelector("[data-role='rateDisplay']"),
    incBtn: root.querySelector("[data-role='incBtn']"),
    decBtn: root.querySelector("[data-role='decBtn']"),
    min: -20,
    max: 20,
    step: 1,
    initial: 0,
  });

  function draw() {
    const rate = rateField.get();
    showReveal({
      shuffleNames: ALL_MENU_NAMES,
      pick: () => {
        const result = pickLunch(rate);
        const sign = rate > 0 ? "+" : "";
        return {
          emoji: result.emoji,
          line1: `오늘은 ${sign}${rate}%군요,`,
          line2: `${result.menu}~`,
          comment: result.comment,
          tone: result.tone,
        };
      },
    });
  }

  drawBtn.addEventListener("click", draw);
}
