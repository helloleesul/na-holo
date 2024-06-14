import { apiFetch } from '../common';

export interface RemoveRecipeDeleteFetchParams {
  id: string;
}

/**
 * 레시피 삭제
 */
export const removeRecipeDeleteFetch = ({ id }: RemoveRecipeDeleteFetchParams) => apiFetch.delete(`/recipes/${id}`);
