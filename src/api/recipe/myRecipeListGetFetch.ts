import { apiFetch } from '../common';
import { RecipeListResponse, RecipeListGetFetchParams } from '@/api/recipe/recipeListGetFetch';

export interface MyRecipeListGetFetchParams extends RecipeListGetFetchParams {}
export interface MyRecipeListResponse extends RecipeListResponse {}

/**
 * 내가 작성한 레시피 게시글 조회 (페이지네이션)
 */
export const myRecipeListGetFetch = (params: MyRecipeListGetFetchParams) => {
  const { page = 0, size = 20 } = params;

  return apiFetch.get<MyRecipeListResponse>(`/mypage/me/recipes?page=${page}&size=${size}&sort=createdAt,desc`);
};
