import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { recipeListGetFetch, RecipeListGetFetchParams } from '@/api/recipe/recipeListGetFetch';
import { COOK_TIME } from '@/pages/RecipeWrite/constants';

/**
 * 레시피 전체 조회
 */
export const useRecipeListQuery = (params: RecipeListGetFetchParams) =>
  useQuery({
    queryKey: ['@recipeList', params],
    queryFn: async () => {
      const res = await recipeListGetFetch(params);

      const { data } = res;

      const { totalElements, totalPages, pageable, content } = data;

      return {
        totalElements,
        totalPages,
        pageable,
        content: [
          ...content.map((item) => {
            const matchingCookTime = COOK_TIME.find((cookTime) => cookTime.param === item.recipeTime);

            return {
              ...item,
              recipeTime: matchingCookTime ? matchingCookTime.value : item.recipeTime.toString(),
            };
          }),
        ],
      };
    },
    staleTime: 5000,
    placeholderData: keepPreviousData,
  });
