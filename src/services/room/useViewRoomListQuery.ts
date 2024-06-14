import { viewRoomListGetFetch } from '@/api/room/roomListGetFetch';
import { useQuery } from '@tanstack/react-query';

/**
 * 인기 방자랑 조회
 */
export const useViewRoomListQuery = () =>
  useQuery({
    queryKey: ['@view-roomList'],
    queryFn: async () => {
      const response = await viewRoomListGetFetch();

      const { data } = response;

      const { content, size } = data;

      return { content, size };
    },
    staleTime: 5000,
  });
