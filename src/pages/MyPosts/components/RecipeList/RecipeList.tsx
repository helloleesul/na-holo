import { useState } from 'react';
import { Card } from '@/components/Card';

import { PriceSlot } from '@/pages/Main/components/PriceSlot';
import { Pagination } from '@/components/Pagination';

import { useNavigate, generatePath } from 'react-router-dom';
import { RECIPE_PATH } from '@/constants/paths';
import { useMyRecipeListQuery } from '@/services/recipe/useMyRecipeListQuery';
import { SkeletonCard } from '@/components/Skeleton';
import { NoContents } from '../NoContents';
import { NAV_TABS } from '../../constants';

/**
 * 내가 작성한 레시피 글 목록 컴포넌트
 */

const RecipeList = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { data, isLoading, isFetching } = useMyRecipeListQuery({ page: currentPage, size: 20 });

  const navigate = useNavigate();

  const handlePageMove = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {!data?.content.length ? (
        <NoContents {...NAV_TABS.recipe} />
      ) : (
        <div className="min-h-[38rem] flex flex-col justify-between mt-10">
          <div className="mb-4 flex items-center">
            <span className="text-medium text-gray700 mr-1">전체</span>
            <span className="text-sm font-light text-gray400">{data.totalElements}</span>
          </div>
          <div className="grid grid-cols-4 gap-6 place-items-start pb-12">
            {isLoading || isFetching
              ? Array.from({ length: 20 }).map((_, index) => <SkeletonCard key={index} />)
              : data?.content?.map((card, i) => (
                  <Card
                    key={i}
                    title={card?.title}
                    description={card?.description}
                    userName={card?.userName}
                    imageUrl={card?.imageUrl}
                    lineClamp={1}
                    slot={
                      <PriceSlot
                        cookInfo={{
                          portions: card?.portions,
                          cookTime: card?.recipeTime,
                        }}
                      />
                    }
                    likes={card.relatedDto.likeCount}
                    onPageMove={() =>
                      navigate(
                        generatePath(RECIPE_PATH.detail, {
                          id: card.id.toString(),
                        }),
                      )
                    }
                  />
                ))}
          </div>
          <Pagination totalPage={data?.totalPages as number} currentPage={currentPage} onPageChange={handlePageMove} />
        </div>
      )}
    </>
  );
};

export default RecipeList;
