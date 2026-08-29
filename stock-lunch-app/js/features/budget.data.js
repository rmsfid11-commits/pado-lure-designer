// 오늘 하루치 점심 예산 금액대별 코멘트 (하드코딩)
// roulette.data.js와 같은 패턴: 위에서부터 순서대로 검사, minInclusive 이상이면 확정.
export const BUDGET_TABLE = [
  { minInclusive: 20000, comment: "오늘은 플렉스 해도 됩니다." },
  { minInclusive: 13000, comment: "웬만한 메뉴는 다 가능해요." },
  { minInclusive: 9000, comment: "국밥 각이네요." },
  { minInclusive: 6000, comment: "적당히 아껴 먹을 때예요." },
  { minInclusive: 1, comment: "오늘은 편의점이 답입니다." },
  { minInclusive: -Infinity, comment: "오늘은 산소만 마셔야겠어요." },
];

export function getBudgetComment(amount) {
  return BUDGET_TABLE.find((b) => amount >= b.minInclusive).comment;
}
