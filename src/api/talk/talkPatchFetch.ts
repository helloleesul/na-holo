import { apiFetch } from '../common';
import { ResponseModel } from '../model';
import { WriteTalkPostFetchParams } from './writeTalkPostFetch';

export interface TalkPatchFetchParams extends WriteTalkPostFetchParams {
  /**
   * Talk 게시물 아이디
   */
  id: number;
}

export interface TalkPatchResponse extends ResponseModel {}

/**
 * Talk 게시물 수정
 */
export const talkPatchFetch = ({ id }: TalkPatchFetchParams) => apiFetch.post<TalkPatchResponse>(`/talk/${id}`);
