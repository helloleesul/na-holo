import axios from 'axios';
import { useUserStore } from '@/store/useUserStore';
// import { PATH } from '@/constants/paths';
// import { redirectDocument } from 'react-router-dom';
// import { refreshPostFetch } from './member/refreshPostFetch';

export const baseURL = import.meta.env.VITE_APP_BASE_URL;

export const apiFetch = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export const kakaoFetch = axios.create({
  headers: {
    'Content-type': ' application/x-www-form-urlencoded;charset=utf-8',
  },
});

const isExitApplication = false;

apiFetch.interceptors.request.use((config) => {
  if (isExitApplication) {
    throw new axios.Cancel('Application Exit!');
  }

  const { accessToken } = useUserStore.getState();

  if (accessToken) {
    config.headers.set('Authorization', accessToken);
  }

  return config;
});

apiFetch.interceptors.response.use(async (res) => {
  // if (!isExitApplication && res.data.status === 401 && res.data.error === 'UNAUTHORIZED') {
  //   const originalRequest = res.config;

  //   const { data } = await refreshPostFetch();

  //   console.log('새로운 ㅁㅊㅊ', data);

  //   if (data.accessToken) {
  //     // 기존 요청에 새로운 토큰을 설정
  //     res.config.headers.set('Authorization', data.accessToken);
  //     // 요청을 재시도
  //     return apiFetch(originalRequest);
  //   } else {
  //     // 새로운 토큰을 받지 못한 경우
  //     alert(
  //       '다른 기기에서 동일한 아이디로 로그인되어 자동로그아웃 되었습니다. 서비스를 계속 이용하시려면 다시 로그인 하시기 바랍니다!',
  //     );

  //     useUserStore.persist.clearStorage();
  //     isExitApplication = true;

  //     // 메인 페이지로 리다이렉트
  //     location.href = PATH.root;
  //   }
  // }

  return res;
});
