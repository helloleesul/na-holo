import { useQuery } from '@tanstack/react-query';

import { COOK_TIME } from '@/pages/RecipeWrite/constants';
import { trendsRecipeListGetFetch } from '@/api/recipe/recipeListGetFetch';

/**
 * 트렌드 레시피 조회
 */
export const useTrendsRecipeListQuery = () =>
  useQuery({
    queryKey: ['@trends-recipeList'],
    queryFn: async () => {
      const res = await trendsRecipeListGetFetch();

      const { data } = res;

      const { content, size } = data;

      const newContent = [
        ...content.map((item) => {
          const matchingCookTime = COOK_TIME.find((cookTime) => cookTime.param === item.recipeTime);

          return {
            ...item,
            recipeTime: matchingCookTime ? matchingCookTime.value : item.recipeTime.toString(),
          };
        }),
      ];

      return { content: newContent, size };
    },
    staleTime: 5000,
  });
