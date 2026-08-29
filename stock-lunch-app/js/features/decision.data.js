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

export function filterMenus({ solo, timeMinutes, priceTier }) {
  const strict = DECISION_MENUS.filter(
    (m) => (solo ? m.solo : m.group) && m.maxTime <= timeMinutes && m.priceTier <= priceTier
  );
  if (strict.length > 0) return strict;

  const withoutSoloFilter = DECISION_MENUS.filter(
    (m) => m.maxTime <= timeMinutes && m.priceTier <= priceTier
  );
  return withoutSoloFilter.length > 0 ? withoutSoloFilter : DECISION_MENUS;
}

export function pickFromPool(pool) {
  const item = pool[Math.floor(Math.random() * pool.length)];
  const comment = DECISION_COMMENTS[Math.floor(Math.random() * DECISION_COMMENTS.length)];
  return { ...item, comment };
}
