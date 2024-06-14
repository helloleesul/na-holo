import { CheckCircle, CircleXIcon } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useToast } from '@/hooks/useToast';
import { TOAST } from '@/constants/toast';

import { RemoveRoomDeleteFetchParams, removeRoomDeleteFetch } from '@/api/room/removeRoomDeleteFetch';
import { useNavigate } from 'react-router-dom';

/**
 * 내가 작성한 방자랑 삭제
 */
export const useRoomDeleteMutation = () => {
  const { toast } = useToast();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (params: RemoveRoomDeleteFetchParams) => removeRoomDeleteFetch(params),
    onSuccess: () => {
      toast({
        title: '방자랑이 삭제되었습니다.',
        icon: <CheckCircle />,
        className: TOAST.success,
      });
      navigate(-1);
      queryClient.invalidateQueries({ queryKey: ['@roomList'] });
    },
    onError: (error) => {
      console.error('방자랑 삭제 실패', error);

      toast({
        title: '방자랑 삭제를 실패했습니다.',
        icon: <CircleXIcon />,
        className: TOAST.error,
      });
    },
  });
  return mutation;
};
