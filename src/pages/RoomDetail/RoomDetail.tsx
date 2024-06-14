import { generatePath, useNavigate, useParams } from 'react-router-dom';
import parse from 'html-react-parser';

import { Appbar } from '@/components/Appbar';
import { Marks } from '@/components/Marks';
import { Layout } from '@/layout';
import { useRoomDetailQuery } from '@/services/room/useRoomDetailQuery';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { EmblaCarousel } from './components/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel';
import dayjs from 'dayjs';
import { Eye, MessageSquareMore } from 'lucide-react';
import { useCommentListQuery } from '@/services/comment/useCommentListQuery';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { commentSchema } from '../RecipeDetail/validator';
import { addCommentPostFetch } from '@/api/comment/addCommentPostFetch';
import { CommentForm } from '@/components/CommentForm';
import { SkeletonComment } from '@/components/SkeletonComment';
import { Comment } from '@/components/Comment';
import { useUserStore } from '@/store/useUserStore';
import { Spinner } from '@/components/Spinner';
import { Confirm } from '@/components/Confirm';
import { useModalStore } from '@/store/useModalStore';
import { useRoomDeleteMutation } from '@/services/room/useRoomDeleteMutation';
import { PATH } from '@/constants/paths';

/**
 * 방자랑 게시글 상세페이지
 */
const RoomDetail = () => {
  const { id: roomId } = useParams();

  const userId = useUserStore((state) => state.id);
  const userProfileImage = useUserStore((state) => state.imageUrl);

  const onOpen = useModalStore((state) => state.onOpen);
  const setModal = useModalStore((state) => state.setModal);
  const onClose = useModalStore((state) => state.onClose);

  const navigate = useNavigate();

  const { mutate } = useRoomDeleteMutation();

  if (!roomId) return;

  const { data, isLoading, isError, refetch: detailRefetch } = useRoomDetailQuery({ roomId });
  // console.info('🚀 ~ RoomDetail ~ data:', data);

  if (isError) navigate('/not-found');

  const {
    data: commentData,
    refetch: commentRefetch,
    isFetching: commentFetching,
  } = useCommentListQuery({ postId: roomId });

  const method = useForm({
    resolver: yupResolver(commentSchema),
    values: {
      content: '',
    },
  });

  const {
    handleSubmit: submit,
    control,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = method;

  const handleSubmit = submit(async () => {
    try {
      const content = getValues('content').trim();

      const addParams = {
        content,
        postId: parseInt(roomId, 10),
      };

      await addCommentPostFetch(addParams);

      setValue('content', '');

      await commentRefetch();
    } catch (error) {
      console.error(error);
    }
  });

  const handleNavigate = () => {
    navigate(
      generatePath(PATH.roomWrite, {
        id: roomId,
      }),
    );
  };

  const handleRemoveRoom = () => {
    mutate({ roomId });
    onClose();
  };

  const OPTIONS: EmblaOptionsType = {};
  const SLIDES = data?.contentImages;

  return (
    <>
      <Appbar />
      <Layout>
        {!isLoading ? (
          <>
            {/* TODO: 좋아요, 북마크 완료되면 붙이기 */}
            <Marks postId={Number(roomId)} data={data} refetch={detailRefetch} />
            <div className="w-3/4 mx-auto flex flex-col gap-8 pb-8">
              <section className="border-b pb-4 flex justify-between items-center">
                <h3 className="text-3xl font-semibold">{data?.title}</h3>
                {userId === data?.memberId && (
                  <div className="flex gap-4">
                    <Button
                      className="rounded-none text-gray700  hover:bg-white hover:border-gray400"
                      variant="outline"
                      onClick={handleNavigate}
                    >
                      수정
                    </Button>
                    <Button
                      className="rounded-none text-gray700  hover:bg-white hover:border-gray400"
                      variant="outline"
                      onClick={() => {
                        setModal(
                          <Confirm
                            title="방자랑 삭제"
                            content="방자랑을 삭제하시겠어요?"
                            submitButtonText="삭제"
                            onSubmit={handleRemoveRoom}
                            onClose={onClose}
                          />,
                        );

                        onOpen();
                      }}
                    >
                      삭제
                    </Button>
                  </div>
                )}
              </section>
              <section className="flex items-center justify-between">
                <div className="flex gap-2 items-center text-sm">
                  <Avatar>
                    <AvatarImage src={data?.imageUrl} />
                    <AvatarFallback>{data?.memberName}</AvatarFallback>
                  </Avatar>
                  By <span className="text-lg">{data?.memberName}</span>
                </div>
                <span className="text-gray500 text-sm">{dayjs(data?.createdAt).format('YYYY년 MM월 DD일')}</span>
              </section>

              <EmblaCarousel slides={SLIDES} options={OPTIONS} />

              {data && <div className="no-tailwind">{parse(`${data.content}`)}</div>}

              <div className="flex gap-2 items-center justify-end text-gray500 text-sm border-t pt-5">
                <div className="flex items-center gap-1">
                  <Eye strokeWidth="1.5" />
                  <span>조회수</span>
                  <span>{data?.view}</span>
                </div>
                <span>·</span>
                <div className="flex items-center gap-1">
                  <MessageSquareMore strokeWidth="1.5" />
                  <span>댓글</span>
                  <span>{data?.commentCount}</span>
                </div>
              </div>

              <CommentForm
                name="content"
                control={control}
                imageUrl={userProfileImage}
                error={errors?.content}
                onSubmit={handleSubmit}
                value={watch('content')}
              />
              {commentFetching ? (
                <div className="flex flex-col justify-center gap-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonComment key={i} />
                  ))}
                </div>
              ) : commentData && commentData.length > 0 ? (
                commentData?.map((item) => (
                  <Comment key={item.id} write={userId === item?.memberId} commentRefetch={commentRefetch} {...item} />
                ))
              ) : (
                <div className="min-h-40 flex items-center justify-around p-4 border border-gray-300 shadow-md rounded-xl">
                  <div>
                    <p className="leading-8  text-lg text-primary font-semibold">
                      아직 댓글이 없는 게시글이에요. <br />첫 댓글의 주인공이 되어보세요!
                    </p>
                  </div>
                  <img className="w-32 h-32" src="/icons/notFound.svg" alt="" />
                </div>
              )}
            </div>
          </>
        ) : (
          <Spinner>방자랑을 불러오고 있어요 ... </Spinner>
        )}
      </Layout>
    </>
  );
};

export default RoomDetail;
