import { apiFetch } from '../common';
import { ResponseModel } from '../model';
import { WriteTalkPostFetchParams } from './writeTalkPostFetch';

export interface TalkPatchFetchParams extends WriteTalkPostFetchParams {
  /**
   * Talk 게시물 아이디
   */
  id: number | null;
}

export interface TalkPatchResponse extends ResponseModel {
  /**
   * Talk 게시물 아이디
   */
  id: number;
}

/**
 * Talk 게시물 수정
 */
export const talkPatchFetch = (params: TalkPatchFetchParams) =>
  apiFetch.patch<TalkPatchResponse>(`/talk/${params.id}`, params);
