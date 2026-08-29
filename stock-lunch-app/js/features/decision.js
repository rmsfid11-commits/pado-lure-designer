import { showReveal } from "../revealOverlay.js";
import { pickDecision, DECISION_MENUS } from "./decision.data.js";

function bindPillGroup(groupEl, onChange) {
  const buttons = groupEl.querySelectorAll(".pill");
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.toggle("active", b === btn));
      onChange(btn.dataset.value);
    });
  });
  return () => groupEl.querySelector(".pill.active")?.dataset.value;
}

export function initDecision() {
  const root = document.getElementById("panel-decision");
  const decideBtn = root.querySelector("[data-role='decideBtn']");

  const getSolo = bindPillGroup(root.querySelector("[data-role='soloGroup']"), () => {});
  const getTime = bindPillGroup(root.querySelector("[data-role='timeGroup']"), () => {});
  const getPrice = bindPillGroup(root.querySelector("[data-role='priceGroup']"), () => {});

  decideBtn.addEventListener("click", () => {
    const conditions = {
      solo: getSolo() === "solo",
      timeMinutes: Number(getTime()),
      priceTier: Number(getPrice()),
    };

    showReveal({
      shuffleNames: DECISION_MENUS.map((m) => m.menu),
      pick: () => {
        const result = pickDecision(conditions);
        return {
          emoji: result.emoji,
          line1: "30초 결정 완료,",
          line2: `${result.menu}~`,
          comment: result.comment,
          tone: null,
        };
      },
    });
  });
}
