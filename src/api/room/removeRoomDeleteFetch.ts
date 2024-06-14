import { apiFetch } from '../common';
import { ResponseModel } from '../model';

export interface RemoveRoomDeleteFetchParams {
  /**
   * 삭제할 방자랑 게시물 ID
   */
  roomId: string;
}

export interface RemoveRoomResponse extends ResponseModel {}

/**
 * 방자랑 삭제
 */
export const removeRoomDeleteFetch = (params: RemoveRoomDeleteFetchParams) => {
  const { roomId } = params;

  return apiFetch.delete<RemoveRoomResponse>(`/room/${roomId}`);
};
