import { createNumberField } from "../numberField.js";
import { findBudgetTier, pickBudgetComment } from "./budget.data.js";

const won = (v) => `${v.toLocaleString("ko-KR")}원`;

export function initBudget() {
  const root = document.getElementById("panel-budget");
  const resultAmount = root.querySelector("[data-role='resultAmount']");
  const resultComment = root.querySelector("[data-role='resultComment']");

  let ready = false;
  let lastTier = null;
  let cachedComment = "";
  function recalc() {
    if (!ready) return;
    const todayBudget = Math.round(budgetField.get() / daysField.get() / 500) * 500;
    const tier = findBudgetTier(todayBudget);
    if (tier !== lastTier) {
      lastTier = tier;
      cachedComment = pickBudgetComment(tier);
    }
    resultAmount.textContent = won(todayBudget);
    resultComment.textContent = cachedComment;
  }

  const daysField = createNumberField({
    valueEl: root.querySelector("[data-role='daysValue']"),
    dragEl: root.querySelector("[data-role='daysDisplay']"),
    incBtn: root.querySelector("[data-role='daysInc']"),
    decBtn: root.querySelector("[data-role='daysDec']"),
    min: 1,
    max: 30,
    step: 1,
    initial: 10,
    format: (v) => `${v}`,
    onChange: recalc,
  });

  const budgetField = createNumberField({
    valueEl: root.querySelector("[data-role='budgetValue']"),
    dragEl: root.querySelector("[data-role='budgetDisplay']"),
    incBtn: root.querySelector("[data-role='budgetInc']"),
    decBtn: root.querySelector("[data-role='budgetDec']"),
    min: 0,
    max: 2000000,
    step: 10000,
    initial: 200000,
    pixelsPerStep: 25,
    format: (v) => v.toLocaleString("ko-KR"),
    onChange: recalc,
  });

  ready = true;
  recalc();
}
