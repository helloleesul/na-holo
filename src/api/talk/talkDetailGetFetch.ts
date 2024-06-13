import { apiFetch } from '../common';
import { ResponseModel } from '../model';

export interface TalkDetailGetFetchParams {
  /**
   * 혼잣말 게시물 아이디
   */
  id: string;
}

export interface TalkDetailResponse extends ResponseModel {
  /**
   * 혼잣말 게시물 아이디
   */
  id: number;

  /**
   * 작성자 아이디
   */
  memberId: number;

  /**
   * 게시물 제목
   */
  title: string;

  /**
   * 게시물 본문 내용
   */
  content: string;

  /**
   * 작성자 닉네임
   */
  memberName: string;

  /**
   * 게시물 스크랩 수
   */
  scrapCount: number;

  /**
   * 게시물 좋아요 수
   */
  likeCount: number;

  /**
   * 유저 북마크 여부
   */
  scrap: boolean;

  /**
   * 유저 좋아요 여부
   */
  like: boolean;

  /**
   * 게시물 작성일자
   */
  createdAt: string;

  /**
   * 댓글 수
   */
  commentCount: number;

  /**
   * 게시물 조회수
   */
  view: number;

  /**
   * 멤버 프로필 이미지 URL
   */
  imageUrl: string | undefined;
}

export const talkDetailGetFetch = ({ id }: TalkDetailGetFetchParams) => apiFetch.get<TalkDetailResponse>(`/talk/${id}`);
