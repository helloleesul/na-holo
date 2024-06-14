import { useQuery } from '@tanstack/react-query';

import { myRecipeListGetFetch, MyRecipeListGetFetchParams } from '@/api/recipe/myRecipeListGetFetch';

import { COOK_TIME } from '@/pages/RecipeWrite/constants';

/**
 *내가 작성한 레시피 조회
 */
export const useMyRecipeListQuery = (params: MyRecipeListGetFetchParams) =>
  useQuery({
    queryKey: ['@my-recipeList', params],
    queryFn: async () => {
      const res = await myRecipeListGetFetch(params);

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
  });
