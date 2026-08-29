// 수익률 구간별 메뉴 데이터 (하드코딩, 외부 데이터/API 없음)
// price는 대략적인 1인 기준 평균 체감가(원). 실제 시세 API 연동 아님 — 손맛으로 잡은 값.
// 구간은 위에서부터 순서대로 검사하며, minInclusive 이상이면 해당 구간으로 확정된다.
export const LUNCH_TABLE = [
  {
    id: "surge",
    label: "+3% 이상",
    minInclusive: 3,
    emoji: "🚀",
    tone: "gain",
    options: [
      { menu: "삼겹살", price: 15000, comment: "오늘은 계좌가 쏜다." },
      { menu: "소고기", price: 25000, comment: "익절한 김에 고기 파티." },
      { menu: "런치 오마카세", price: 35000, comment: "일단 오늘만큼은 플렉스." },
      { menu: "한우", price: 40000, comment: "이 정도면 가불 아니고 리얼 수익이다." },
      { menu: "스테이크", price: 28000, comment: "오늘만큼은 손 크게 나가도 된다." },
      { menu: "장어구이", price: 30000, comment: "몸보신까지 챙기는 익절 세리머니." },
      { menu: "참치집 런치세트", price: 30000, comment: "부위별로 다 시켜도 되는 날." },
      { menu: "이자카야 코스", price: 35000, comment: "역시 오늘은 좀 취해도 되는 날." },
    ],
  },
  {
    id: "up",
    label: "+1% ~ +3%",
    minInclusive: 1,
    emoji: "😋",
    tone: "gain",
    options: [
      { menu: "돈까스", price: 10000, comment: "수익도 났겠다 든든하게." },
      { menu: "초밥", price: 12000, comment: "이 정도면 한 접시 정돈 괜찮지." },
      { menu: "찜닭", price: 13000, comment: "무난하게 든든한 한 끼." },
      { menu: "부대찌개", price: 9000, comment: "이 정도 수익이면 사리 추가요." },
      { menu: "치킨마요덮밥", price: 7000, comment: "적당히 배부르게, 적당히 뿌듯하게." },
      { menu: "돼지갈비", price: 17000, comment: "삼겹살 말고 오늘은 갈비 정돈 괜찮지." },
      { menu: "갈비탕", price: 11000, comment: "뜨끈하고 든든하게." },
      { menu: "냉면", price: 9000, comment: "이 정도 수익엔 시원하게 한 그릇." },
      { menu: "콩국수", price: 9000, comment: "여름엔 이게 국룰이지, 오늘 같은 날엔 더." },
      { menu: "쌀국수", price: 10000, comment: "이국적인 기분으로 가볍게 플렉스." },
      { menu: "라멘", price: 11000, comment: "진한 국물로 든든하게, 오늘 정돈 괜찮지." },
      { menu: "쭈꾸미볶음", price: 11000, comment: "매콤하게 스트레스도 함께 볶아버리기." },
      { menu: "갈치조림", price: 12000, comment: "간만에 생선 한 토막 정돈 괜찮지." },
      { menu: "두루치기", price: 10000, comment: "매콤달콤 볶아서 든든하게." },
      { menu: "낙지비빔밥", price: 11000, comment: "매콤하게 비벼서 스트레스도 비벼버리기." },
      { menu: "불고기", price: 13000, comment: "달콤짭짤하게, 오늘 하루 보상." },
      { menu: "감자탕", price: 11000, comment: "뼈까지 발라먹는 든든함." },
      { menu: "삼계탕", price: 16000, comment: "몸보신까지 챙기는 여유." },
      { menu: "알탕", price: 12000, comment: "얼큰하고 든든하게, 오늘 정돈 괜찮지." },
      { menu: "매운탕", price: 13000, comment: "화끈하게 한 그릇, 오늘 하루 보상." },
      { menu: "낙지덮밥", price: 11000, comment: "매콤하게 기분 전환." },
    ],
  },
  {
    id: "flat",
    label: "-1% ~ +1%",
    minInclusive: -1,
    emoji: "😐",
    tone: "neutral",
    options: [
      { menu: "국밥", price: 9000, comment: "시장도 점심도 보합." },
      { menu: "김치찌개", price: 8000, comment: "오늘은 그냥 무난하게." },
      { menu: "제육볶음", price: 9000, comment: "특별할 것 없는 하루, 든든하게만." },
      { menu: "비빔밥", price: 9000, comment: "오르지도 내리지도 않는 내 마음처럼 잘 비벼서." },
      { menu: "구내식당", price: 6000, comment: "오늘은 그냥 회사 밥이 진리다." },
      { menu: "된장찌개", price: 8000, comment: "이것도 저것도 아닌 무난함." },
      { menu: "짜장면", price: 7000, comment: "고민될 땐 짜장면이 국룰." },
      { menu: "김치찜", price: 12000, comment: "속은 얼큰하게, 마음은 무난하게." },
      { menu: "순대국밥", price: 9000, comment: "이것도 국밥, 저것도 국밥, 오늘은 순대국밥." },
      { menu: "육개장", price: 9000, comment: "얼큰하고 든든한, 무난의 정석." },
      { menu: "칼국수", price: 8000, comment: "쫄깃한 면발로 하루를 버텨봅니다." },
      { menu: "청국장", price: 8000, comment: "호불호는 있지만 몸엔 좋은 선택." },
      { menu: "수육백반", price: 10000, comment: "담백하게, 무난하게." },
      { menu: "고등어구이백반", price: 9000, comment: "짭짤한 생선 한 마리, 소박한 만족." },
      { menu: "코다리조림", price: 10000, comment: "짭조름하게 밥 한 공기 뚝딱." },
      { menu: "순두부찌개", price: 8000, comment: "부드럽게 속을 달래는 한 끼." },
      { menu: "동태찌개", price: 9000, comment: "얼큰함으로 하루를 시작." },
      { menu: "곤드레밥", price: 9000, comment: "건강한 나물밥으로 무난하게." },
      { menu: "오징어볶음", price: 10000, comment: "매콤하지만 무난한 선택." },
      { menu: "제육쌈밥", price: 10000, comment: "쌈 싸먹는 재미로 무난하게." },
      { menu: "두부김치", price: 9000, comment: "심플하지만 실패 없는 조합." },
      { menu: "소불고기덮밥", price: 9000, comment: "달달하게, 무난하게." },
      { menu: "추어탕", price: 10000, comment: "몸엔 좋다는데 맛은 호불호." },
      { menu: "설렁탕", price: 9000, comment: "뽀얀 국물로 속을 달래며." },
      { menu: "곰탕", price: 10000, comment: "든든하고 무난한 한 그릇." },
      { menu: "뼈해장국", price: 9000, comment: "어제도 오늘도 무난한 해장." },
      { menu: "오징어덮밥", price: 9000, comment: "매콤한 오징어로 하루 시작." },
    ],
  },
  {
    id: "down",
    label: "-1% ~ -3%",
    minInclusive: -3,
    emoji: "😥",
    tone: "loss",
    options: [
      { menu: "김밥", price: 3000, comment: "오늘은 방어적으로 간다." },
      { menu: "샌드위치", price: 6000, comment: "지갑도 계좌도 아껴야 할 때." },
      { menu: "라면", price: 5000, comment: "손실 구간엔 손실 구간의 메뉴가 있다." },
      { menu: "컵라면", price: 1500, comment: "물만 부어도 위로가 되는 맛." },
      { menu: "떡볶이", price: 5000, comment: "맵게 먹고 오늘 손실은 잊자." },
      { menu: "토스트", price: 4000, comment: "간단하게 때우는 게 답." },
      { menu: "우동", price: 6000, comment: "따뜻하게라도 위로받자." },
      { menu: "핫도그", price: 4000, comment: "길거리 음식으로 버티는 날." },
      { menu: "계란말이백반", price: 8000, comment: "계란 하나로 단백질은 챙긴다." },
      { menu: "스팸김치볶음밥", price: 8000, comment: "냉동실 스팸이라도 있어서 다행이다." },
      { menu: "김치볶음밥", price: 7000, comment: "냉장고 파먹기, 오늘의 미덕." },
      { menu: "만두국", price: 7000, comment: "간단하게 속만 채우는 날." },
      { menu: "콩나물국밥", price: 7000, comment: "해장도 되고 절약도 되고." },
      { menu: "모듬순대", price: 9000, comment: "분식으로 버티는 하루." },
    ],
  },
  {
    id: "crash",
    label: "-3% 이하",
    minInclusive: -Infinity,
    emoji: "💀",
    tone: "loss",
    options: [
      { menu: "편의점 도시락", price: 4500, comment: "계좌가 다이어트를 시켰다." },
      { menu: "삼각김밥", price: 1500, comment: "존버는 배고프다." },
      { menu: "물만 마시기", price: 0, comment: "오늘은... 내일 다시 보자." },
      { menu: "공복 유지", price: 0, comment: "오늘 점심은 그냥 존버다." },
      { menu: "탕비실 믹스커피", price: 0, comment: "밥값도 아끼는 게 손실 방어다." },
      { menu: "즉석밥+김", price: 2000, comment: "그래도 뭔가는 먹어야지." },
      { menu: "회사 정수기 물", price: 0, comment: "무한리필의 미학." },
      { menu: "아무것도 안 먹기", price: 0, comment: "이게 최선의 절약이다." },
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

// "다시 뽑기"를 눌러도 직전과 같은 메뉴가 바로 다시 나오지 않게 제외한다.
export function pickLunch(rate, excludeMenu) {
  const bracket = getBracket(rate);
  const candidates =
    excludeMenu && bracket.options.length > 1
      ? bracket.options.filter((o) => o.menu !== excludeMenu)
      : bracket.options;
  const option = candidates[Math.floor(Math.random() * candidates.length)];
  return { ...option, label: bracket.label, emoji: bracket.emoji, tone: bracket.tone };
}

export const ALL_MENU_NAMES = LUNCH_TABLE.flatMap((b) => b.options.map((o) => o.menu));
