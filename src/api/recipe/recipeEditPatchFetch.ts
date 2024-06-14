import { apiFetch } from '../common';
import { ResponseModel } from '../model';
import { WriteRecipePostFetchParams } from '@/api/recipe/writeRecipePostFetch';

export interface RecipeEditPatchFetchParams extends WriteRecipePostFetchParams {
  /**
   * 게시물 식별값
   */
  id: number;
}

export interface RecipeEditResponse extends ResponseModel {}

/**
 * 레시피 작성 및 등록
 */
export const recipeEditPatchFetch = ({ id, ...rest }: RecipeEditPatchFetchParams) =>
  apiFetch.patch<RecipeEditResponse>(`/recipes/${id}`, rest);
