import { apiFetch } from '../common';

export interface NaverAuthUrlGetFetchParams {}

export type NaverAuthUrlResponse = string;

/**
 * 네이버 oauth url 요청
 */
export const naverAuthUrlGetFetch = () => apiFetch.get<NaverAuthUrlResponse>('/naver');
