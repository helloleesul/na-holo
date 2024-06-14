import { addCommentPostFetch } from '@/api/comment/addCommentPostFetch';
import { Appbar } from '@/components/Appbar';
import { Layout } from '@/layout';
import { useTalkDetailQuery } from '@/services/talk/useTalkDetailQuery';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Marks } from '@/components/Marks';
import { useCommentListQuery } from '@/services/comment/useCommentListQuery';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { commentSchema } from '../RecipeDetail/validator';
import { SkeletonComment } from '@/components/SkeletonComment';
import { useUserStore } from '@/store/useUserStore';
import { Comment } from '@/components/Comment';
import { CommentForm } from '@/components/CommentForm';
import { Spinner } from '@/components/Spinner';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Eye, MessageSquareMore } from 'lucide-react';
import parse from 'html-react-parser';
import { PATH } from '@/constants/paths';
import { useEffect } from 'react';
import { useTalkDeleteMutation } from '@/services/talk/useTalkDeleteMutation';
import { Confirm } from '@/components/Confirm';
import { useModalStore } from '@/store/useModalStore';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * 혼잣말 게시글 상세페이지
 */
const TalkDetail = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const id = pathname.split('/')[2];
  const userId = useUserStore((state) => state.id);
  const imageUrl = useUserStore((state) => state.imageUrl);

  const onOpen = useModalStore((state) => state.onOpen);
  const setModal = useModalStore((state) => state.setModal);
  const onClose = useModalStore((state) => state.onClose);

  const { mutate } = useTalkDeleteMutation();

  const { data, refetch: detailRefetch, isLoading: detailLoading } = useTalkDetailQuery({ id });

  console.info(data);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const {
    data: commentData,
    refetch: commentRefetch,
    isFetching: commentFetching,
  } = useCommentListQuery({ postId: id.toString() });

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
        postId: parseInt(id, 10),
      };

      await addCommentPostFetch(addParams);

      setValue('content', '');

      await commentRefetch();
    } catch (error) {
      console.error(error);
    }
  });

  const handleRemoveTalk = () => {
    mutate({ talkId: id });
    onClose();
  };

  return (
    <>
      <Appbar />
      <Layout>
        {!detailLoading && data ? (
          <>
            <Marks postId={Number(id)} data={data} refetch={detailRefetch} />
            <div className="w-3/4 mx-auto flex flex-col gap-8 pb-8">
              <section className="border-b pb-4 flex justify-between items-center">
                <h3 className="text-3xl font-semibold">{data?.title}</h3>
                {userId === data?.memberId && (
                  <div className="flex gap-4">
                    <Button
                      className="rounded-none text-gray700  hover:bg-white hover:border-gray400"
                      variant="outline"
                      onClick={() => navigate(`${PATH.talkWrite}?id=${id}`)}
                    >
                      수정
                    </Button>
                    <Button
                      className="rounded-none text-gray700  hover:bg-white hover:border-gray400"
                      variant="outline"
                      onClick={() => {
                        setModal(
                          <Confirm
                            title="혼잣말 삭제"
                            content="혼잣말을 삭제하시겠어요?"
                            submitButtonText="삭제"
                            onSubmit={handleRemoveTalk}
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
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-light">{data?.memberName}</span>
                </div>
                <span className="text-gray500 text-sm font-light">
                  {dayjs(data?.createdAt).format('YYYY년 MM월 DD일')}
                </span>
              </section>
              {data && <div className="h-36">{parse(`${data.content}`)}</div>}
            </div>
            <div className="w-3/4 mx-auto pb-24">
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
                imageUrl={imageUrl}
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
          <Spinner>혼잣말을 불러오고 있어요 …</Spinner>
        )}
      </Layout>
    </>
  );
};

export default TalkDetail;
