import { useQuery } from '@tanstack/react-query';

import { recipeDetailGetFetch, RecipeDetailGetFetchParams } from '@/api/recipe/recipeDetailGetFetch';

/**
 * 레시피 상세 조회
 */
export const useRecipeEditQuery = ({ id }: RecipeDetailGetFetchParams) =>
  useQuery({
    queryKey: ['@recipe-edit', id],
    queryFn: async () => {
      const res = await recipeDetailGetFetch({ id });

      const { data } = res;

      return data;
    },
    staleTime: 5000,
  });
