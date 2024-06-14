import { apiFetch } from '../common';
import { ResponseModel } from '../model';

export interface RoomListGetFetchParams {
  /**
   * 요청할 페이지 번호
   * - 0 이 1번째
   */
  page?: number;

  /**
   * 한 페이지에 표시할 게시물의 수
   */
  size?: number;
}

export interface RoomListResponse extends ResponseModel {
  content: {
    /**
     * 방자랑 게시물 id
     */
    id: number;

    /**
     * 방자랑 제목
     */
    title: string;

    /**
     * 작성자
     */
    memberName: string;

    /**
     * 작성자 프로필 이미지
     */
    imageUrl: string;

    /**
     * 댓글 갯수
     */
    commentCount: number;

    /**
     * 좋아요 갯수
     */
    likeCount: number;

    /**
     * 작성 날짜
     */
    createdAt: string;

    /**
     * 대표 이미지 URL
     */
    thumbnailUrl: string;

    /**
     * 컨텐츠 요약
     */
    contentSummary: string;
  }[];

  /**
   * 페이지네이션
   */
  pageable: {
    /**
     * 현재 페이지
     */
    pageNumber: 0;

    /**
     * 호출한 페이지별 아이템 갯수
     */
    pageSize: 20;
  };

  /**
   * 총 게시물 갯수
   */
  totalElements: number;

  /**
   * 총 페이지 갯수
   */
  totalPages: number;

  /**
   * 현재 보여주는 갯수
   */
  size: number;
}

/**
 * 방자랑 게시글 조회 (페이지네이션)
 */
export const roomListGetFetch = (params: RoomListGetFetchParams) => {
  const { page = 0, size = 20 } = params;

  return apiFetch.get<RoomListResponse>(`/room?page=${page}&size=${size}&sort=createdAt,desc`);
};

/**
 * 인기 방자랑 조회
 */
export const viewRoomListGetFetch = () => {
  return apiFetch.get<RoomListResponse>('/room/view?page=0');
};
