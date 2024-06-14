import { apiFetch } from '../common';
import { ResponseModel } from '../model';

export interface RecipeListGetFetchParams {
  /**
   * 요청할 페이지 번호
   * - 0 이 1번째
   */
  page?: number;

  /**
   * 한 페이지에 표시할 게시물의 수
   */
  size?: number;
}

export interface RecipeListResponse extends ResponseModel {
  content: {
    /**
     * 유저 식별값
     */
    id: number;

    /**
     * 레시피 제목
     */
    title: string;

    /**
     * 설명
     */
    description: string;

    /**
     * n인분
     */
    portions: number;

    /**
     * 국/탕, 찜/찌개..
     */
    recipeType: string;

    /**
     * 조리시간
     */
    recipeTime: string;

    /**
     * 한식 양식 중식..
     */
    cuisine: string;

    /**
     * 이미지 path
     */
    imageUrl: string;

    /**
     * 유저 이름
     */
    userName: string;

    relatedDto: {
      likeCount: number;
      scrapCount: number;
      commentCount: number;
      likeByCurrentUser: boolean;
      bookmarked: boolean;
    };
  }[];

  /**
   * 페이지네이션
   */
  pageable: {
    /**
     * 현재 페이지
     */
    pageNumber: 0;

    /**
     * 호출한 페이지별 아이템 갯수
     */
    pageSize: 20;
  };

  /**
   * 총 게시물 갯수
   */
  totalElements: number;

  /**
   * 총 페이지 갯수
   */
  totalPages: number;

  /**
   * 현재 보여주는 갯수
   */
  size: number;
}

/**
 * 레시피 게시글 조회 (페이지네이션)
 */
export const recipeListGetFetch = (params: RecipeListGetFetchParams) => {
  const { page = 0, size = 20 } = params;

  return apiFetch.get<RecipeListResponse>(`/recipes?page=${page}&size=${size}&sort=createdAt,desc`);
};

/**
 * 트렌드 레시피 조회
 */
export const trendsRecipeListGetFetch = () => {
  return apiFetch.get<RecipeListResponse>('/recipes/trends?page=0');
};
