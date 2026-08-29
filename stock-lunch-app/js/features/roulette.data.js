// 수익률 구간별 메뉴 데이터 (하드코딩, 외부 데이터/API 없음)
// 구간은 위에서부터 순서대로 검사하며, minInclusive 이상이면 해당 구간으로 확정된다.
export const LUNCH_TABLE = [
  {
    id: "surge",
    label: "+3% 이상",
    minInclusive: 3,
    emoji: "🚀",
    tone: "gain",
    options: [
      { menu: "삼겹살", comment: "오늘은 계좌가 쏜다." },
      { menu: "소고기", comment: "익절한 김에 고기 파티." },
      { menu: "오마카세", comment: "일단 오늘만큼은 플렉스." },
      { menu: "한우", comment: "이 정도면 가불 아니고 리얼 수익이다." },
      { menu: "스테이크", comment: "오늘만큼은 손 크게 나가도 된다." },
    ],
  },
  {
    id: "up",
    label: "+1% ~ +3%",
    minInclusive: 1,
    emoji: "😋",
    tone: "gain",
    options: [
      { menu: "돈까스", comment: "수익도 났겠다 든든하게." },
      { menu: "초밥", comment: "이 정도면 한 접시 정돈 괜찮지." },
      { menu: "찜닭", comment: "무난하게 든든한 한 끼." },
      { menu: "부대찌개", comment: "이 정도 수익이면 사리 추가요." },
      { menu: "치킨마요덮밥", comment: "적당히 배부르게, 적당히 뿌듯하게." },
    ],
  },
  {
    id: "flat",
    label: "-1% ~ +1%",
    minInclusive: -1,
    emoji: "😐",
    tone: "neutral",
    options: [
      { menu: "국밥", comment: "시장도 점심도 보합." },
      { menu: "김치찌개", comment: "오늘은 그냥 무난하게." },
      { menu: "제육볶음", comment: "특별할 것 없는 하루, 든든하게만." },
      { menu: "비빔밥", comment: "오르지도 내리지도 않는 내 마음처럼 잘 비벼서." },
      { menu: "구내식당", comment: "오늘은 그냥 회사 밥이 진리다." },
    ],
  },
  {
    id: "down",
    label: "-1% ~ -3%",
    minInclusive: -3,
    emoji: "😥",
    tone: "loss",
    options: [
      { menu: "김밥", comment: "오늘은 방어적으로 간다." },
      { menu: "샌드위치", comment: "지갑도 계좌도 아껴야 할 때." },
      { menu: "라면", comment: "손실 구간엔 손실 구간의 메뉴가 있다." },
      { menu: "컵라면", comment: "물만 부어도 위로가 되는 맛." },
      { menu: "떡볶이", comment: "맵게 먹고 오늘 손실은 잊자." },
    ],
  },
  {
    id: "crash",
    label: "-3% 이하",
    minInclusive: -Infinity,
    emoji: "💀",
    tone: "loss",
    options: [
      { menu: "편의점 도시락", comment: "계좌가 다이어트를 시켰다." },
      { menu: "삼각김밥", comment: "존버는 배고프다." },
      { menu: "물만 마시기", comment: "오늘은... 내일 다시 보자." },
      { menu: "공복 유지", comment: "오늘 점심은 그냥 존버다." },
      { menu: "탕비실 믹스커피", comment: "밥값도 아끼는 게 손실 방어다." },
    ],
  },
];

// 점심 뽑고 나서 곁들이는 "애프터 점심" (커피/음료), 수익 톤별로.
const AFTER_LUNCH = {
  gain: [
    { emoji: "☕", name: "아이스 아메리카노", reason: "오늘같은 날엔 시원하게 한 잔." },
    { emoji: "🍰", name: "조각 케이크", reason: "익절 기념 디저트도 가능." },
  ],
  neutral: [
    { emoji: "☕", name: "믹스커피", reason: "무난하게 하루 마무리." },
    { emoji: "🍬", name: "사탕 하나", reason: "입가심 정도로 충분." },
  ],
  loss: [
    { emoji: "🥤", name: "정수기 물", reason: "오늘은 커피값도 아껴야지." },
    { emoji: "☕", name: "탕비실 믹스커피", reason: "공짜가 최고의 디저트." },
  ],
};

export function getBracket(rate) {
  return LUNCH_TABLE.find((b) => rate >= b.minInclusive);
}

export function pickAfterLunch(tone) {
  const pool = AFTER_LUNCH[tone] ?? AFTER_LUNCH.neutral;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function pickLunch(rate) {
  const bracket = getBracket(rate);
  const option = bracket.options[Math.floor(Math.random() * bracket.options.length)];
  return { ...option, label: bracket.label, emoji: bracket.emoji, tone: bracket.tone };
}

export const ALL_MENU_NAMES = LUNCH_TABLE.flatMap((b) => b.options.map((o) => o.menu));
