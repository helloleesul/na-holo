import { apiFetch } from '../common';
import { ResponseModel } from '../model';

export interface RefreshResponse extends ResponseModel {
  accessToken: string;
}

/**
 * 토큰 리프레쉬
 */
export const refreshPostFetch = () => apiFetch.post<RefreshResponse>('/token/refresh');
