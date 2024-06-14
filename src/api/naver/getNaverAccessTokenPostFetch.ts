import { apiFetch } from '../common';

export interface GetNaverAccessTokenPostFetchParams {
  /**
   * authorization_code로 고정	O
   */
  grant_type: 'authorization_code';

  /**
   * env
   */
  client_id: string;

  /**
   * env
   */
  client_secret: string;

  /**
   * 쿼리스트링 code
   */
  code: string;

  /**
   * 쿼리스트링 state
   */
  state: string;
}

/**
 * 카카오에서 accessToken을 가져온다.
 */
export const getNaverAccessTokenPostFetch = ({
  grant_type,
  client_id,
  client_secret,
  code,
  state,
}: GetNaverAccessTokenPostFetchParams) =>
  apiFetch.get(
    `/oauth/naver/token?grant_type=${grant_type}&client_id=${client_id}&client_secret=${client_secret}&code=${code}&state=${state}`,
  );
