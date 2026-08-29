// 30초 결정용 메뉴 풀 (하드코딩). solo/group, 소요 시간, 평균 가격, 나라별(cuisine)로 태깅해두고
// 사용자가 고른 조건으로 필터링 후 무작위로 하나를 뽑는다.
// price는 대략적인 1인 기준 평균 체감가(원) — 여기서 예산 태그(priceTier)를 자동으로 계산한다.
// cuisine: "한식" | "중식" | "일식" | "양식" | "아시안" | "기타"
const RAW_DECISION_MENUS = [
  { menu: "김밥", emoji: "🍙", solo: true, group: true, maxTime: 10, price: 3000, cuisine: "한식" },
  { menu: "편의점 도시락", emoji: "🍱", solo: true, group: false, maxTime: 5, price: 4500, cuisine: "기타" },
  { menu: "구내식당", emoji: "🍚", solo: true, group: true, maxTime: 15, price: 6000, cuisine: "한식" },
  { menu: "라면", emoji: "🍜", solo: true, group: true, maxTime: 15, price: 5000, cuisine: "한식" },
  { menu: "국밥", emoji: "🍲", solo: true, group: true, maxTime: 20, price: 9000, cuisine: "한식" },
  { menu: "샐러드", emoji: "🥗", solo: true, group: false, maxTime: 10, price: 9000, cuisine: "양식" },
  { menu: "돈까스", emoji: "🍱", solo: true, group: true, maxTime: 20, price: 10000, cuisine: "일식" },
  { menu: "초밥", emoji: "🍣", solo: true, group: true, maxTime: 25, price: 12000, cuisine: "일식" },
  { menu: "부대찌개", emoji: "🍲", solo: false, group: true, maxTime: 25, price: 9000, cuisine: "한식" },
  { menu: "찜닭", emoji: "🍗", solo: false, group: true, maxTime: 30, price: 13000, cuisine: "한식" },
  { menu: "삼겹살", emoji: "🥓", solo: false, group: true, maxTime: 40, price: 15000, cuisine: "한식" },
  { menu: "런치 오마카세", emoji: "🍣", solo: true, group: true, maxTime: 40, price: 35000, cuisine: "일식" },
  { menu: "김치찌개", emoji: "🫕", solo: true, group: true, maxTime: 25, price: 8000, cuisine: "한식" },
  { menu: "짜장면", emoji: "🥡", solo: true, group: true, maxTime: 15, price: 7000, cuisine: "중식" },
  { menu: "회덮밥", emoji: "🐟", solo: true, group: true, maxTime: 20, price: 12000, cuisine: "일식" },
  { menu: "갈비탕", emoji: "🍖", solo: true, group: true, maxTime: 20, price: 11000, cuisine: "한식" },
  { menu: "떡볶이", emoji: "🌶️", solo: true, group: true, maxTime: 10, price: 5000, cuisine: "한식" },
  { menu: "샌드위치", emoji: "🥪", solo: true, group: false, maxTime: 5, price: 6000, cuisine: "양식" },
  { menu: "파스타", emoji: "🍝", solo: true, group: true, maxTime: 25, price: 13000, cuisine: "양식" },
  { menu: "소고기", emoji: "🥩", solo: false, group: true, maxTime: 40, price: 25000, cuisine: "한식" },
  { menu: "제육볶음", emoji: "🥘", solo: true, group: true, maxTime: 20, price: 9000, cuisine: "한식" },
  { menu: "된장찌개", emoji: "🍲", solo: true, group: true, maxTime: 20, price: 8000, cuisine: "한식" },
  { menu: "냉면", emoji: "🍜", solo: true, group: true, maxTime: 15, price: 9000, cuisine: "한식" },
  { menu: "김치찜", emoji: "🫕", solo: true, group: true, maxTime: 30, price: 12000, cuisine: "한식" },
  { menu: "돼지갈비", emoji: "🥓", solo: false, group: true, maxTime: 40, price: 17000, cuisine: "한식" },
  { menu: "순대국밥", emoji: "🍲", solo: true, group: true, maxTime: 20, price: 9000, cuisine: "한식" },
  { menu: "콩국수", emoji: "🥣", solo: true, group: true, maxTime: 15, price: 9000, cuisine: "한식" },
  { menu: "쌀국수", emoji: "🍜", solo: true, group: true, maxTime: 20, price: 9000, cuisine: "아시안" },
  { menu: "라멘", emoji: "🍜", solo: true, group: true, maxTime: 20, price: 11000, cuisine: "일식" },
  { menu: "쭈꾸미볶음", emoji: "🐙", solo: true, group: true, maxTime: 25, price: 11000, cuisine: "한식" },
  { menu: "육개장", emoji: "🍲", solo: true, group: true, maxTime: 20, price: 9000, cuisine: "한식" },
  { menu: "칼국수", emoji: "🍜", solo: true, group: true, maxTime: 20, price: 8000, cuisine: "한식" },
  { menu: "청국장", emoji: "🍲", solo: true, group: true, maxTime: 20, price: 8000, cuisine: "한식" },
  { menu: "수육백반", emoji: "🍚", solo: true, group: true, maxTime: 20, price: 10000, cuisine: "한식" },
  { menu: "고등어구이백반", emoji: "🐟", solo: true, group: true, maxTime: 20, price: 9000, cuisine: "한식" },
  { menu: "갈치조림", emoji: "🐟", solo: true, group: true, maxTime: 20, price: 12000, cuisine: "한식" },
  { menu: "코다리조림", emoji: "🐟", solo: true, group: true, maxTime: 20, price: 10000, cuisine: "한식" },
  { menu: "계란말이백반", emoji: "🍳", solo: true, group: true, maxTime: 15, price: 8000, cuisine: "한식" },
  { menu: "두루치기", emoji: "🥘", solo: true, group: true, maxTime: 25, price: 10000, cuisine: "한식" },
  { menu: "순두부찌개", emoji: "🍲", solo: true, group: true, maxTime: 15, price: 8000, cuisine: "한식" },
  { menu: "동태찌개", emoji: "🍲", solo: true, group: true, maxTime: 20, price: 9000, cuisine: "한식" },
  { menu: "곤드레밥", emoji: "🍚", solo: true, group: true, maxTime: 15, price: 9000, cuisine: "한식" },
  { menu: "낙지비빔밥", emoji: "🐙", solo: true, group: true, maxTime: 20, price: 11000, cuisine: "한식" },
  { menu: "오징어볶음", emoji: "🦑", solo: true, group: true, maxTime: 20, price: 10000, cuisine: "한식" },
  { menu: "불고기", emoji: "🥩", solo: false, group: true, maxTime: 30, price: 13000, cuisine: "한식" },
  { menu: "제육쌈밥", emoji: "🥬", solo: true, group: true, maxTime: 20, price: 10000, cuisine: "한식" },
  { menu: "두부김치", emoji: "🥘", solo: true, group: true, maxTime: 15, price: 9000, cuisine: "한식" },
  { menu: "감자탕", emoji: "🍲", solo: false, group: true, maxTime: 30, price: 11000, cuisine: "한식" },
  { menu: "소불고기덮밥", emoji: "🍚", solo: true, group: true, maxTime: 15, price: 9000, cuisine: "한식" },
  { menu: "삼계탕", emoji: "🍗", solo: true, group: true, maxTime: 30, price: 16000, cuisine: "한식" },
  { menu: "추어탕", emoji: "🍲", solo: true, group: true, maxTime: 20, price: 10000, cuisine: "한식" },
  { menu: "알탕", emoji: "🍲", solo: false, group: true, maxTime: 25, price: 12000, cuisine: "한식" },
  { menu: "매운탕", emoji: "🍲", solo: false, group: true, maxTime: 25, price: 13000, cuisine: "한식" },
  { menu: "설렁탕", emoji: "🍚", solo: true, group: true, maxTime: 20, price: 9000, cuisine: "한식" },
  { menu: "곰탕", emoji: "🍚", solo: true, group: true, maxTime: 20, price: 10000, cuisine: "한식" },
  { menu: "뼈해장국", emoji: "🍲", solo: true, group: true, maxTime: 20, price: 9000, cuisine: "한식" },
  { menu: "낙지덮밥", emoji: "🐙", solo: true, group: true, maxTime: 20, price: 11000, cuisine: "한식" },
  { menu: "오징어덮밥", emoji: "🦑", solo: true, group: true, maxTime: 20, price: 9000, cuisine: "한식" },
  { menu: "스팸김치볶음밥", emoji: "🍳", solo: true, group: true, maxTime: 15, price: 8000, cuisine: "한식" },
  { menu: "김치볶음밥", emoji: "🍳", solo: true, group: true, maxTime: 15, price: 7000, cuisine: "한식" },
  { menu: "모듬순대", emoji: "🌭", solo: true, group: true, maxTime: 15, price: 9000, cuisine: "한식" },
  { menu: "만두국", emoji: "🥟", solo: true, group: true, maxTime: 15, price: 7000, cuisine: "한식" },
  { menu: "콩나물국밥", emoji: "🍚", solo: true, group: true, maxTime: 15, price: 7000, cuisine: "한식" },
  { menu: "짬뽕", emoji: "🍜", solo: true, group: true, maxTime: 20, price: 9000, cuisine: "중식" },
  { menu: "마파두부덮밥", emoji: "🌶️", solo: true, group: true, maxTime: 15, price: 8000, cuisine: "중식" },
  { menu: "팟타이", emoji: "🍤", solo: true, group: true, maxTime: 20, price: 11000, cuisine: "아시안" },
  { menu: "반미", emoji: "🥖", solo: true, group: false, maxTime: 10, price: 7000, cuisine: "아시안" },
];

// 5천원 이하 -> 1, 1만원 이하 -> 2, 그 이상 -> 3 (priceGroup 필터 pill 라벨과 맞춤)
function priceToTier(price) {
  if (price <= 5000) return 1;
  if (price <= 10000) return 2;
  return 3;
}

export const DECISION_MENUS = RAW_DECISION_MENUS.map((m) => ({ ...m, priceTier: priceToTier(m.price) }));

const DECISION_COMMENTS = [
  "고민 끝, 이걸로 가자.",
  "더 고민하면 지각이다.",
  "30초 지났다, 확정.",
  "오늘은 이거다.",
];

// "다시 뽑기"를 눌러도 항상 같은 메뉴만 나오는 걸 막기 위한 최소 후보 수.
// 조건을 다 지키는 후보가 이보다 적으면 덜 중요한 조건부터 하나씩 완화한다.
const MIN_POOL_SIZE = 3;

export function filterMenus({ solo, cuisine, timeMinutes, priceTier }) {
  const matchesGroup = (m) => (solo ? m.solo : m.group);
  const matchesCuisine = (m) => cuisine === "all" || m.cuisine === cuisine;
  const matchesTime = (m) => m.maxTime <= timeMinutes;
  const matchesPrice = (m) => m.priceTier <= priceTier;

  // 혼밥/같이, 나라별은 "누구랑 어떤 걸 먹느냐"를 결정하는 실질적 제약이라 최후의 보루로 남겨두고,
  // 시간 -> 예산 -> (그래도 부족하면) 나라별 -> 혼밥/같이 순으로 완화한다.
  const relaxationSteps = [
    (m) => matchesGroup(m) && matchesCuisine(m) && matchesTime(m) && matchesPrice(m), // 다 지키기
    (m) => matchesGroup(m) && matchesCuisine(m) && matchesPrice(m), // 시간 완화
    (m) => matchesGroup(m) && matchesCuisine(m), // 예산도 완화
    (m) => matchesGroup(m), // 나라별도 완화
    () => true, // 혼밥/같이까지 완화 (전체 메뉴, 진짜 마지막 수단)
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
