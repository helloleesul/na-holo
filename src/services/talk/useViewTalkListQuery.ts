import { viewTalkListGetFetch } from '@/api/talk/talkListGetFetch';
import { useQuery } from '@tanstack/react-query';

/**
 * 인기 혼잣말 조회
 */
export const useViewTalkListQuery = () =>
  useQuery({
    queryKey: ['@view-talkList'],
    queryFn: async () => {
      const response = await viewTalkListGetFetch();

      const { data } = response;

      const { content, size } = data;

      return { content, size };
    },
    staleTime: 5000,
  });
