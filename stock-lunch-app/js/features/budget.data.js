// 오늘 하루치 점심 예산 금액대별 코멘트 (하드코딩)
// roulette.data.js와 같은 패턴: 위에서부터 순서대로 검사, minInclusive 이상이면 확정.
// 구간마다 코멘트를 여러 개 둬서 같은 금액대를 봐도 매번 문구가 바뀌게 함.
export const BUDGET_TABLE = [
  {
    minInclusive: 20000,
    emoji: "🤩",
    best: true,
    comments: ["오늘은 플렉스 해도 됩니다.", "오마카세도 가능한 예산이에요.", "이 정도면 회사 몰래 배 채우기 성공."],
  },
  {
    minInclusive: 13000,
    emoji: "😋",
    comments: ["웬만한 메뉴는 다 가능해요.", "고기도 노려볼 수 있는 예산.", "메뉴판 고민할 여유가 생겼네요."],
  },
  {
    minInclusive: 9000,
    emoji: "🙂",
    comments: ["국밥 각이네요.", "무난한 한 끼는 확정입니다.", "든든하게 먹을 수 있어요."],
  },
  {
    minInclusive: 6000,
    emoji: "😐",
    comments: ["적당히 아껴 먹을 때예요.", "분식 정도로 만족해야 할 예산.", "오늘은 소박하게 갑니다."],
  },
  {
    minInclusive: 1,
    emoji: "😥",
    comments: ["오늘은 편의점이 답입니다.", "삼각김밥이 최선일 수도.", "가성비를 최우선으로."],
  },
  {
    minInclusive: -Infinity,
    emoji: "💀",
    comments: ["오늘은 산소만 마셔야겠어요.", "공복이 답인 하루.", "탕비실 믹스커피로 버텨봅시다."],
  },
];

// 금액에 해당하는 구간(tier)을 찾는다. 같은 구간인 동안은 호출부에서
// 코멘트를 다시 뽑지 않고 캐시해서, 드래그 중 문구가 계속 깜빡이지 않게 한다.
export function findBudgetTier(amount) {
  return BUDGET_TABLE.find((b) => amount >= b.minInclusive);
}

export function pickBudgetComment(tier) {
  return tier.comments[Math.floor(Math.random() * tier.comments.length)];
}
