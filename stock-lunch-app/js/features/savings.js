import { createNumberField } from "../numberField.js";
import { spawnConfettiInto } from "../revealOverlay.js";

const WORK_DAYS_PER_MONTH = 22; // 하드코딩된 월 근무일수 (화면에도 이 가정을 표시함)
const won = (v) => `${v.toLocaleString("ko-KR")}원`;

// 상황(구간)별 문구를 여러 개 둬서 매번 다르게 보이게 함. 드래그 중에는
// 구간이 바뀌지 않는 한 같은 템플릿을 유지해서 문구가 깜빡이지 않게 캐시한다.
const MESSAGE_TEMPLATES = {
  negative: {
    emoji: "😅",
    templates: [
      (d) => `오늘은 오히려 ${won(Math.abs(d))} 더 썼어요... 내일은 아껴봐요.`,
      (d) => `${won(Math.abs(d))} 초과 지출! 내일 만회합시다.`,
      (d) => `오늘은 손실 확정, 평소보다 ${won(Math.abs(d))} 더 썼어요.`,
    ],
  },
  zero: {
    emoji: "😐",
    templates: [
      () => "오늘은 평소랑 똑같이 썼어요. 절약은 내일부터.",
      () => "본전이에요. 나쁘지 않아요.",
      () => "딱 평소만큼 썼네요. 내일을 노려봅시다.",
    ],
  },
  positiveWithShares: {
    emoji: "🎉",
    best: true,
    templates: [
      (d, m, shares) => `오늘 ${won(d)} 아꼈어요. 이대로 한 달이면 ${won(m)} — 관심 종목 ${shares}주 살 수 있어요!`,
      (d, m, shares) => `${won(d)} 절약 성공! 한 달 모으면 ${shares}주 확보 가능해요.`,
      (d, m, shares) => `잘 아꼈어요. 한 달 ${won(m)}이면 ${shares}주 가즈아.`,
    ],
  },
  positiveNoShares: {
    emoji: "🙂",
    templates: [
      (d, m) => `오늘 ${won(d)} 아꼈어요. 한 달이면 ${won(m)} — 아직 한 주는 못 사지만 계속 모아봐요.`,
      (d, m) => `${won(d)} 절약! 한 달 모아도 한 주는 아직이지만 시작이 반이에요.`,
      (d, m) => `조금씩 모으는 중이에요. 한 달 모으면 ${won(m)}.`,
    ],
  },
};

export function initSavings() {
  const root = document.getElementById("panel-savings");
  const resultBox = root.querySelector("[data-role='result']");
  const resultConfetti = root.querySelector("[data-role='resultConfetti']");
  const resultEmoji = root.querySelector("[data-role='resultEmoji']");
  const resultMessage = root.querySelector("[data-role='resultMessage']");

  let ready = false;
  let lastKey = null;
  let cachedTemplate = null;

  function recalc() {
    if (!ready) return;
    const dailySaving = usualField.get() - todayField.get();
    const monthlySaving = dailySaving * WORK_DAYS_PER_MONTH;
    const stockPrice = stockField.get();
    const shares = dailySaving > 0 ? Math.floor(monthlySaving / stockPrice) : 0;

    const key =
      dailySaving < 0 ? "negative" : dailySaving === 0 ? "zero" : shares > 0 ? "positiveWithShares" : "positiveNoShares";
    const group = MESSAGE_TEMPLATES[key];

    if (key !== lastKey) {
      lastKey = key;
      cachedTemplate = group.templates[Math.floor(Math.random() * group.templates.length)];

      resultBox.classList.remove("settled");
      void resultBox.offsetWidth;
      resultBox.classList.add("settled");

      if (group.best) {
        spawnConfettiInto(resultConfetti, 18);
        if (navigator.vibrate) navigator.vibrate(20);
      }
    }

    resultEmoji.textContent = group.emoji;
    resultMessage.textContent = cachedTemplate(dailySaving, monthlySaving, shares);
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
