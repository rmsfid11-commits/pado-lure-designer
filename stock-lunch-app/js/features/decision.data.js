// 30초 결정용 메뉴 풀 (하드코딩). solo/group, 소요 시간, 가격대로 태깅해두고
// 사용자가 고른 조건으로 필터링 후 무작위로 하나를 뽑는다.
// priceTier: 1 = 5천원대, 2 = 1만원대, 3 = 1.5만원 이상
export const DECISION_MENUS = [
  { menu: "김밥", emoji: "🍙", solo: true, group: true, maxTime: 10, priceTier: 1 },
  { menu: "편의점 도시락", emoji: "🍱", solo: true, group: false, maxTime: 5, priceTier: 1 },
  { menu: "구내식당", emoji: "🍚", solo: true, group: true, maxTime: 15, priceTier: 1 },
  { menu: "라면", emoji: "🍜", solo: true, group: true, maxTime: 15, priceTier: 1 },
  { menu: "국밥", emoji: "🍲", solo: true, group: true, maxTime: 20, priceTier: 1 },
  { menu: "샐러드", emoji: "🥗", solo: true, group: true, maxTime: 10, priceTier: 2 },
  { menu: "돈까스", emoji: "🍱", solo: true, group: true, maxTime: 20, priceTier: 2 },
  { menu: "초밥", emoji: "🍣", solo: true, group: true, maxTime: 25, priceTier: 2 },
  { menu: "부대찌개", emoji: "🍲", solo: false, group: true, maxTime: 25, priceTier: 2 },
  { menu: "찜닭", emoji: "🍗", solo: false, group: true, maxTime: 30, priceTier: 2 },
  { menu: "삼겹살", emoji: "🥓", solo: false, group: true, maxTime: 40, priceTier: 3 },
  { menu: "오마카세", emoji: "🍣", solo: true, group: true, maxTime: 40, priceTier: 3 },
];

const DECISION_COMMENTS = [
  "고민 끝, 이걸로 가자.",
  "더 고민하면 지각이다.",
  "30초 지났다, 확정.",
  "오늘은 이거다.",
];

// "다시 뽑기"를 눌러도 항상 같은 메뉴만 나오는 걸 막기 위한 최소 후보 수.
// 조건을 다 지키는 후보가 이보다 적으면 덜 중요한 조건부터 하나씩 완화한다.
const MIN_POOL_SIZE = 3;

export function filterMenus({ solo, timeMinutes, priceTier }) {
  const matchesGroup = (m) => (solo ? m.solo : m.group);
  const matchesTime = (m) => m.maxTime <= timeMinutes;
  const matchesPrice = (m) => m.priceTier <= priceTier;

  const relaxationSteps = [
    (m) => matchesGroup(m) && matchesTime(m) && matchesPrice(m), // 다 지키기
    (m) => matchesTime(m) && matchesPrice(m), // 혼밥/같이 완화
    (m) => matchesPrice(m), // 시간도 완화
    () => true, // 예산도 완화 (전체 메뉴)
  ];

  for (const test of relaxationSteps) {
    const pool = DECISION_MENUS.filter(test);
    if (pool.length >= MIN_POOL_SIZE) return pool;
  }
  return DECISION_MENUS;
}

export function pickFromPool(pool) {
  const item = pool[Math.floor(Math.random() * pool.length)];
  const comment = DECISION_COMMENTS[Math.floor(Math.random() * DECISION_COMMENTS.length)];
  return { ...item, comment };
}
