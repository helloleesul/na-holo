import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ThumbsUp, CircleCheck, CircleXIcon } from 'lucide-react';
import { isAxiosError } from 'axios';
import { QueryObserverResult } from '@tanstack/react-query';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/Input';
import { Button } from '@/components/ui/button';
import { commentSchema } from '@/pages/RecipeDetail/validator';

import { useToast } from '@/hooks/useToast';

import { getRelativeTime } from './util';

import { CommentListResponse } from '@/api/comment/commentListGetFetch';
import { updateCommentPatchFetch } from '@/api/comment/updateCommentPatchFetch';
import { removeCommentDeleteFetch } from '@/api/comment/removeCommentDeleteFetch';

import { TOAST } from '@/constants/toast';
import { useModalStore } from '@/store/useModalStore';
import { Confirm } from '../Confirm';

interface CommentPropsType extends Omit<CommentListResponse, 'message'> {
  write: boolean;
  commentRefetch: () => Promise<QueryObserverResult<CommentListResponse[], Error>>;
}

/**
 * 댓글 리스트 공통 컴포넌트
 */
const Comment = (props: CommentPropsType) => {
  const { write, commentRefetch, ...rest } = props;

  const { toast } = useToast();

  const onOpen = useModalStore((state) => state.onOpen);
  const setModal = useModalStore((state) => state.setModal);
  const onClose = useModalStore((state) => state.onClose);

  const method = useForm({
    resolver: yupResolver(commentSchema),
    values: {
      content: rest?.content,
    },
  });

  const {
    handleSubmit,
    control,
    trigger,
    watch,
    getValues,
    formState: { errors },
  } = method;

  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleEditComment = handleSubmit(async () => {
    try {
      if (!(await trigger('content'))) return;

      const content = getValues('content');

      const updateParams = {
        id: rest.id,
        content,
        postId: rest.postId,
      };

      const updateResponse = await updateCommentPatchFetch(updateParams);

      toast({
        title: updateResponse.data.message || '댓글이 수정되었어요.',
        icon: <CircleCheck />,
        className: TOAST.success,
      });

      await commentRefetch();
    } catch (error) {
      console.error(error);

      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message || '댓글 수정 실패',
          icon: <CircleXIcon />,
          className: TOAST.error,
        });
      }
    }
  });

  const handleRemoveComment = async () => {
    try {
      await removeCommentDeleteFetch({ commentId: rest.id });

      toast({
        title: '댓글이 삭제되었어요.',
        icon: <CircleCheck />,
        className: TOAST.success,
      });

      await commentRefetch();

      onClose();
    } catch (error) {
      console.error(error);
      if (isAxiosError(error)) {
        toast({
          title: '댓글 삭제에 실패했어요.',
          icon: <CircleXIcon />,
          className: TOAST.error,
        });
      }
    }
  };

  return (
    <div className="h-fit w-full">
      <div className="flex gap-4 p-4">
        <Avatar className="w-7 h-7">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start gap-3">
          <ul className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <li className="font-normal text-black">{rest.memberName}</li>
            <li>{getRelativeTime(rest.modifiedAt)}</li>
          </ul>
          {isEdit ? (
            <div className="flex flex-col justify-center grow">
              <Input control={control} name="content" type="text" error={errors?.content} value={watch('content')} />
              <div className="mt-2 flex gap-2">
                <Button variant="ghost" onClick={() => setIsEdit(false)}>
                  취소
                </Button>
                <Button onClick={handleEditComment}>수정</Button>
              </div>
            </div>
          ) : (
            <p className="text-sm">{rest.content}</p>
          )}
          <div className="flex items-center justify-center gap-2">
            <button className="flex items-center justify-center gap-1">
              <ThumbsUp size={16} color="#9ca3af" strokeWidth={1} /> <span className="text-xs text-gray-400">0</span>
            </button>
          </div>
        </div>
        {write ? (
          <ul className="flex gap-2 text-xs text-gray400 ml-auto">
            <li>
              <Button variant="ghost" onClick={() => setIsEdit(true)}>
                수정
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                onClick={() => {
                  setModal(
                    <Confirm
                      title="댓글 삭제"
                      content="댓글을 삭제하시겠어요?"
                      submitButtonText="삭제"
                      onSubmit={handleRemoveComment}
                      onClose={onClose}
                    />,
                  );

                  onOpen();
                }}
              >
                삭제
              </Button>
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default Comment;
