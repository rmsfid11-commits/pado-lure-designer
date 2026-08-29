import { createNumberField } from "../numberField.js";

const WORK_DAYS_PER_MONTH = 22; // 하드코딩된 월 근무일수 (화면에도 이 가정을 표시함)
const won = (v) => `${v.toLocaleString("ko-KR")}원`;

export function initSavings() {
  const root = document.getElementById("panel-savings");
  const resultMessage = root.querySelector("[data-role='resultMessage']");

  let ready = false;
  function recalc() {
    if (!ready) return;
    const dailySaving = usualField.get() - todayField.get();
    const monthlySaving = dailySaving * WORK_DAYS_PER_MONTH;
    const stockPrice = stockField.get();

    let message;
    if (dailySaving < 0) {
      message = `오늘은 오히려 ${won(Math.abs(dailySaving))} 더 썼어요... 내일은 아껴봐요.`;
    } else if (dailySaving === 0) {
      message = "오늘은 평소랑 똑같이 썼어요. 절약은 내일부터.";
    } else {
      const shares = Math.floor(monthlySaving / stockPrice);
      message =
        shares > 0
          ? `오늘 ${won(dailySaving)} 아꼈어요. 이대로 한 달이면 ${won(monthlySaving)} — 관심 종목 ${shares}주 살 수 있어요!`
          : `오늘 ${won(dailySaving)} 아꼈어요. 한 달이면 ${won(monthlySaving)} — 아직 한 주는 못 사지만 계속 모아봐요.`;
    }

    resultMessage.textContent = message;
  }

  const usualField = createNumberField({
    valueEl: root.querySelector("[data-role='usualValue']"),
    dragEl: root.querySelector("[data-role='usualDisplay']"),
    incBtn: root.querySelector("[data-role='usualInc']"),
    decBtn: root.querySelector("[data-role='usualDec']"),
    min: 0,
    max: 50000,
    step: 500,
    initial: 9000,
    pixelsPerStep: 16,
    format: (v) => v.toLocaleString("ko-KR"),
    onChange: recalc,
  });

  const todayField = createNumberField({
    valueEl: root.querySelector("[data-role='todayValue']"),
    dragEl: root.querySelector("[data-role='todayDisplay']"),
    incBtn: root.querySelector("[data-role='todayInc']"),
    decBtn: root.querySelector("[data-role='todayDec']"),
    min: 0,
    max: 50000,
    step: 500,
    initial: 6000,
    pixelsPerStep: 16,
    format: (v) => v.toLocaleString("ko-KR"),
    onChange: recalc,
  });

  const stockField = createNumberField({
    valueEl: root.querySelector("[data-role='stockValue']"),
    dragEl: root.querySelector("[data-role='stockDisplay']"),
    incBtn: root.querySelector("[data-role='stockInc']"),
    decBtn: root.querySelector("[data-role='stockDec']"),
    min: 1000,
    max: 1000000,
    step: 1000,
    initial: 70000,
    pixelsPerStep: 20,
    format: (v) => v.toLocaleString("ko-KR"),
    onChange: recalc,
  });

  ready = true;
  recalc();
}
