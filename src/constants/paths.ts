/**
 * route path
 */
export const PATH = Object.freeze({
  /**
   * main
   */
  root: '/' as const,

  /**
   * 로그인
   */
  login: '/login' as const,

  /**
   * 회원가입
   */
  register: '/register' as const,

  /**
   * 레시피 페이지
   */
  recipe: '/recipe' as const,

  /**
   * 레시피 작성페이지
   */
  recipeWrite: '/Recipe/write' as const,

  /**
   * 방자랑 페이지
   */
  room: '/room' as const,

  /**
   * 방자랑 작성페이지
   */
  roomWrite: '/room/write' as const,

  /**
   * 혼잣말 페이지
   */
  talk: '/talk' as const,

  /**
   * 혼잣말 작성페이지
   */
  talkWrite: '/talk/write' as const,

  /**
   * 채팅방 목록 페이지
   */
  chattings: '/chattings' as const,

  /**
   * 마이페이지
   */
  mypage: '/mypage' as const,

  /**
   * 작성한 글 페이지
   */
  myPosts: '/mypage/posts' as const,

  /**
   * 카카오 로그인 redirect uri
   */
  kakao: '/kakao/callback' as const,

  /**
   * 네이버 로그인 redirect uri
   */
  naver: '/naver/login' as const,
});

/**
 * Recipe 상세
 */
export const RECIPE_PATH = Object.freeze({
  /**
   * generatePath
   */
  detail: '/recipe/:id' as const,
});

/**
 * room 상세
 */
export const ROOM_PATH = {
  /**
   * generatePath
   */
  detail: '/room/:id',
};

/**
 * talk 상세
 */
export const TALK_PATH = Object.freeze({
  /**
   * generatePath
   */
  detail: '/talk/:id',
});

/**
 * chat 채팅방 상세
 */
export const CHAT_PATH = Object.freeze({
  /**
   * generatePath
   */
  detail: '/chatting/:id' as const,
});

export type PathValue = ValueOf<typeof PATH>;
