import { apiFetch } from '../common';
import { ResponseModel } from '../model';
import { WriteRecipePostFetchParams } from '@/api/recipe/writeRecipePostFetch';

export interface RecipeDetailGetFetchParams {
  /**
   * 게시물 아이디
   */
  id: string;
}

export interface RecipeDetailResponse extends ResponseModel, WriteRecipePostFetchParams {
  /**
   * 게시물 식별값
   */
  id: number;

  /**
   * 게시물 작성자 식별값
   */
  userId: number;

  /**
   * 게시물 작성자 닉네임
   */
  userName: string;

  postTags: {
    tagName: string;
  }[];

  /**
   * 좋아요 북마크 갯수
   */
  relatedDto: {
    /**
     * 조아요
     */
    likeCount: number;

    /**
     * 유저가 누름?
     */
    likeByCurrentUser: boolean;

    /**
     * 북마크
     */
    bookmarked: boolean;

    /**
     * 스크랩카운트?
     */
    scrapCount: string;
  };

  /**
   * 조회수
   */
  view: number;
}

/**
 * 레시피 상세조회
 */
export const recipeDetailGetFetch = ({ id }: RecipeDetailGetFetchParams) =>
  apiFetch.get<RecipeDetailResponse>(`/recipes/${id}`);
