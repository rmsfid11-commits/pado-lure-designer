// 화살표(누르고 있으면 연속 증감) + 드래그 스크러버(위아래로 끌어서 조절)를
// 함께 지원하는 숫자 입력 부품. 룰렛의 수익률, 예산의 금액 등 어디서든 재사용.

function bindHold(button, callback, { delay = 400, interval = 90 } = {}) {
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
    callback();
    holdTimer = setTimeout(() => {
      repeatTimer = setInterval(callback, interval);
    }, delay);
  });

  ["pointerup", "pointerleave", "pointercancel"].forEach((evt) =>
    button.addEventListener(evt, stop)
  );
}

function bindDragScrub(el, { getValue, setValue, stepSize = 1, pixelsPerStep = 14 }) {
  let dragging = false;
  let startY = 0;
  let startValue = 0;
  let lastSteps = 0;

  el.addEventListener("pointerdown", (e) => {
    dragging = true;
    startY = e.clientY;
    startValue = getValue();
    lastSteps = 0;
    el.setPointerCapture(e.pointerId);
    el.classList.add("dragging");
  });

  el.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const deltaY = startY - e.clientY; // 위로 끌면 양수 -> 값 증가
    const steps = Math.round(deltaY / pixelsPerStep);
    if (steps === lastSteps) return;
    lastSteps = steps;
    setValue(startValue + steps * stepSize);
  });

  const endDrag = () => {
    dragging = false;
    el.classList.remove("dragging");
  };
  el.addEventListener("pointerup", endDrag);
  el.addEventListener("pointercancel", endDrag);
}

/**
 * @param {Object} opts
 * @param {HTMLElement} opts.valueEl - 숫자 텍스트를 표시할 엘리먼트
 * @param {HTMLElement} opts.dragEl - 드래그 제스처를 받을 엘리먼트 (보통 valueEl의 부모)
 * @param {HTMLElement} opts.incBtn
 * @param {HTMLElement} opts.decBtn
 * @param {number} opts.min
 * @param {number} opts.max
 * @param {number} [opts.step=1]
 * @param {number} [opts.initial=0]
 * @param {number} [opts.pixelsPerStep=14]
 * @param {(value: number) => string} [opts.format]
 * @param {(value: number) => void} [opts.onChange]
 */
export function createNumberField({
  valueEl,
  dragEl,
  incBtn,
  decBtn,
  min,
  max,
  step = 1,
  initial = 0,
  pixelsPerStep = 14,
  format = (v) => (v > 0 ? `+${v}` : `${v}`),
  onChange,
}) {
  let value = initial;

  function render() {
    valueEl.textContent = format(value);
    onChange?.(value);
  }

  function setValue(next) {
    const clamped = Math.min(max, Math.max(min, next));
    if (clamped === value) return;
    value = clamped;
    render();
    if (navigator.vibrate) navigator.vibrate(4);
  }

  function adjust(delta) {
    setValue(value + delta);
  }

  bindHold(incBtn, () => adjust(step));
  bindHold(decBtn, () => adjust(-step));
  bindDragScrub(dragEl ?? valueEl, {
    getValue: () => value,
    setValue,
    stepSize: step,
    pixelsPerStep,
  });

  render();

  return {
    get: () => value,
    set: setValue,
  };
}
