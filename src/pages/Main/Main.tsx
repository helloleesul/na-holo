import { generatePath, useNavigate } from 'react-router-dom';

import { Layout } from '@/layout';

import { Appbar } from '@/components/Appbar';
import { Card } from '@/components/Card';
import { Card as TextCard } from '@/components/Card';
import { Footer } from '@/components/Footer';
import { SkeletonCard } from '@/components/Skeleton';

import { PriceSlot } from './components/PriceSlot';
import { ListTitle } from './components/ListTitle';

import { PATH, RECIPE_PATH, ROOM_PATH, TALK_PATH } from '@/constants/paths';

import { useTrendsRecipeListQuery } from '@/services/recipe/useTrendsRecipeListQuery';
import { useViewRoomListQuery } from '@/services/room/useViewRoomListQuery';
import { useViewTalkListQuery } from '@/services/talk/useViewTalkListQuery';
import { RoomCardSlot } from '../Room/components/RoomCardSlot';

const Main = () => {
  const navigate = useNavigate();

  const { data: recipeData, isLoading: recipeIsLoading, isFetching: recipeIsFetching } = useTrendsRecipeListQuery();
  const { data: roomData, isLoading: roomIsLoading, isFetching: roomIsFetching } = useViewRoomListQuery();
  const { data: talkData, isLoading: talkIsLoading, isFetching: talkIsFetching } = useViewTalkListQuery();

  return (
    <>
      <Appbar />

      <div className="bg-[#10BE62] -mt-12">
        <img src="/images/main_img.png" className="w-1/2 my-0 mx-auto" />
      </div>

      <Layout>
        {/* 트렌드 레시피 */}
        <ListTitle
          imgPath="/icons/receipe_icon.png"
          title="트렌드 레시피"
          description="하루 10분이면 뚝딱! 사용자들이 많이 보고 있는 레시피에요"
          onPageMove={() => navigate(PATH.recipe)}
        />
        <div className="grid grid-cols-4 gap-6 place-items-start">
          {recipeIsLoading || recipeIsFetching
            ? Array.from({ length: recipeData?.size as number }).map((_, index) => <SkeletonCard key={index} />)
            : recipeData?.content?.map((card, i) => (
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

        {/* 인기 방자랑 */}
        <ListTitle
          imgPath="/icons/room_icon.png"
          title="최근 인기 방자랑"
          description="인테리어 어떻게 할 지 고민될 때! 다른사람들은 어떻게 꾸몄을까요?"
          onPageMove={() => navigate(PATH.room)}
        />
        <div className="grid grid-cols-4 gap-6 place-items-start">
          {roomIsLoading || roomIsFetching
            ? Array.from({ length: roomData?.size as number }).map((_, index) => <SkeletonCard key={index} />)
            : roomData?.content?.map((card, i) => (
                <Card
                  key={i}
                  likes={card?.likeCount}
                  title={card?.title}
                  userName={card?.memberName}
                  userImage={card?.imageUrl}
                  imageUrl={card?.thumbnailUrl}
                  lineClamp={1}
                  slot={<RoomCardSlot createdAt={card?.createdAt} commentCount={card?.commentCount} />}
                  onPageMove={() =>
                    navigate(
                      generatePath(ROOM_PATH.detail, {
                        id: card.id.toString(),
                      }),
                    )
                  }
                />
              ))}
        </div>

        {/* 인기 혼잣말 */}
        <ListTitle
          imgPath="/icons/single_ment.png"
          title="나홀로 집에서 혼잣말"
          description="혼잣말은 일상생활에 힘이 됩니다."
          onPageMove={() => navigate(PATH.talk)}
        />
        <div className="grid grid-cols-4 gap-6 mb-20 place-items-start">
          {talkIsLoading || talkIsFetching
            ? Array.from({ length: talkData?.size as number }).map((_, index) => <SkeletonCard key={index} />)
            : talkData?.content?.map((card) => (
                <TextCard
                  key={card?.id}
                  description={card?.contentSummary}
                  title={card?.title}
                  userName={card?.memberName}
                  lineClamp={1}
                  slot={<RoomCardSlot createdAt={card?.createdAt} commentCount={card?.commentCount} />}
                  likes={card?.likeCount}
                  onPageMove={() =>
                    navigate(
                      generatePath(TALK_PATH.detail, {
                        id: card.id.toString(),
                      }),
                    )
                  }
                />
              ))}
        </div>
      </Layout>
      <Footer />
    </>
  );
};

export default Main;
