import { apiFetch } from '../common';
import { ResponseModel } from '../model';

export interface TalkDeleteFetchParams {
  /**
   * 삭제할 혼잣말 게시물 ID
   */
  talkId: string;
}

export interface RemoveRoomResponse extends ResponseModel {}

/**
 * 혼잣말 삭제
 */
export const talkDeleteFetch = (params: TalkDeleteFetchParams) => {
  const { talkId } = params;

  return apiFetch.delete<RemoveRoomResponse>(`/talk/${talkId}`);
};
