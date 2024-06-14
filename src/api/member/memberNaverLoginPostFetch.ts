import { apiFetch } from '../common';
import { ResponseModel } from '../model';

export interface MemberNaverLoginPostFetchParams {
  accessToken: string;
}

export interface MemberNaverLoginResponse extends ResponseModel {
  accessToken: string;
}

/**
 * 네이버 로그인
 */
export const memberNaverLoginPostFetch = (params: MemberNaverLoginPostFetchParams) =>
  apiFetch.post<MemberNaverLoginResponse>('/naver/login', params);
