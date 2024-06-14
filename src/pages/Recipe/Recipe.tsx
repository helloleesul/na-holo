import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Search } from 'lucide-react';

import { Appbar } from '@/components/Appbar';
import { Card } from '@/components/Card';
import { Footer } from '@/components/Footer';
import { Searchbar } from '@/components/Searchbar';
import { Select } from '@/components/Select';

import { Layout } from '@/layout';

import { ListTitle } from '@/pages/Main/components/ListTitle';
import { PriceSlot } from '@/pages/Main/components/PriceSlot';
import { CATEGORY_OPTIONS } from '../Main/constants';
import { Pagination } from '@/components/Pagination';

import { useNavigate, generatePath } from 'react-router-dom';
import { PATH, RECIPE_PATH } from '@/constants/paths';
import { Button } from '@/components/ui/button';

import { useRecipeListQuery } from '@/services/recipe/useRecipeListQuery';
import { SkeletonCard } from '@/components/Skeleton';

/**
 * 레시피 페이지 컴포넌트
 */
const Receipe = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { data, isLoading, isFetching } = useRecipeListQuery({ page: currentPage, size: 20 });

  const navigate = useNavigate();

  const method = useForm({
    values: { category: '전체', query: '' },
  });

  const handlePageMove = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Appbar />
      <Layout>
        <FormProvider {...method}>
          <div className="flex w-[40rem] gap-4 mx-auto">
            <Select name="category" options={CATEGORY_OPTIONS} />
            <div className="w-[40rem] m-auto relative">
              <Searchbar />
              <Search className="absolute top-[0.5rem] right-[0.6rem] appearance-none" stroke="#737373" />
            </div>
          </div>
        </FormProvider>
        <div className="flex items-center justify-between">
          <ListTitle
            imgPath="/icons/receipe_icon.png"
            title="트렌드 레시피"
            description="하루 10분이면 뚝딱! 사용자들이 많이 보고 있는 레시피에요"
          />
          <Button className="rounded-full" onClick={() => navigate(PATH.recipeWrite)}>
            새 글 작성
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-6 place-items-start">
          {isLoading || isFetching
            ? Array.from({ length: 4 }).map((_, index) => <SkeletonCard key={index} />)
            : data?.content?.slice(13, 17).map((card, i) => (
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
                  likes={40}
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
        <ListTitle imgPath="/icons/receipe_icon.png" title="모든 레시피" />
        <div className="grid grid-cols-4 gap-6 py-12 place-items-start">
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
                  likes={40}
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
      </Layout>
      <Footer />
    </>
  );
};

export default Receipe;
