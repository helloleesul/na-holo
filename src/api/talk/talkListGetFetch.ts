import { apiFetch } from '../common';
import { ResponseModel } from '../model';

export interface TalkListGetFetchParms {
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

export interface TalkListResponse extends ResponseModel {
  content: {
    /**
     * 유저 식별값
     */
    id: number;

    /**
     * 혼잣말 제목
     */
    title: string;

    /**
     * 혼잣말 내용 요약
     */
    contentSummary: string;

    /**
     * 유저 닉네임
     */
    memberName: string;

    /**
     * 유저 프로필 이미지 URL
     */
    imageUrl: string;

    /**
     * 댓글 개수
     */
    commentCount: number;

    /**
     * 좋아요 개수
     */
    likeCount: number;

    /**
     * 작성일자
     */
    createdAt: string;
  }[];

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

  /**
   * 작성자 프로필 이미지 URL
   */
  imageUrl: string | undefined;


}

/**
 * 혼잣말 게시글 조회 (페이지네이션)
 */
export const talkListGetFetch = (params: TalkListGetFetchParms) => {
  const { page = 0, size = 20 } = params;

  return apiFetch.get<TalkListResponse>(`/talk?page=${page}&size=${size}&sort=createdAt,desc`);
};

/**
 * 인기 혼잣말 조회
 */
export const viewTalkListGetFetch = () => {
  return apiFetch.get<TalkListResponse>('/talk/view?page=0');
};
