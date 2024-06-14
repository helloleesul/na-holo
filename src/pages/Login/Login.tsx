import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { isAxiosError } from 'axios';

import { Layout } from '@/layout';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/Input';
import { Appbar } from '@/components/Appbar';

import { PATH } from '@/constants/paths';

import { usePageMoveHandler } from '@/hooks/usePageMoveHandler';

import { MemberLoginPostFetchParams, memberLoginPostFetch } from '@/api/member/memberLoginPostFetch';

import { loginSchema } from './validator';

import { useUserStore } from '@/store/useUserStore';
import { useToast } from '@/hooks/useToast';
import { TOAST } from '@/constants/toast';
import { CircleCheck, CircleXIcon } from 'lucide-react';

import { memberInfoGetFetch } from '@/api/member/memberInfoGetFetch';

import { KakaoButton } from '@/components/KakaoButton';
import { KakaoAuthUrlGetFetch } from '@/api/member/kakaoAuthUrlGetFetch';
import { naverAuthUrlGetFetch } from '@/api/member/naverAuthUrlGetFetch';
import dayjs from 'dayjs';

const Login = () => {
  const navigate = usePageMoveHandler();

  const setAccessToken = useUserStore((state) => state.setAccessToken);
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  const { toast } = useToast();

  const method = useForm({
    resolver: yupResolver(loginSchema),
    values: {
      email: '',
      password: '',
    } as MemberLoginPostFetchParams,
  });

  const {
    handleSubmit: submit,
    control,
    getValues,
    formState: { errors },
  } = method;

  const handleSubmit = submit(async () => {
    try {
      const loginParams = getValues();

      const loginRes = await memberLoginPostFetch(loginParams);

      const { data } = loginRes;

      setAccessToken(data.accessToken);

      const userInfoRes = await memberInfoGetFetch();

      setUserInfo({ ...userInfoRes.data, birth: dayjs(userInfoRes.data.birth).format('YYYYMMDD') });

      toast({
        title: data.message || '로그인 성공',
        icon: <CircleCheck />,
        className: TOAST.success,
      });

      navigate(PATH.root);
    } catch (error) {
      console.error(error);

      if (isAxiosError(error)) {
        toast({
          title: error?.response?.data.message || '로그인 실패',
          icon: <CircleXIcon />,
          className: TOAST.error,
        });
      }
    }
  });

  const handleKakaoLogin = async () => {
    try {
      const urlResponse = await KakaoAuthUrlGetFetch();

      const kakaoUrl = document.createElement('a');

      kakaoUrl.setAttribute('href', urlResponse.data);

      kakaoUrl.click();
    } catch (error) {
      console.error(error);

      if (isAxiosError(error)) {
        toast({
          title: error?.response?.data.message || '카카오 로그인 실패',
          icon: <CircleXIcon />,
          className: TOAST.error,
        });
      }
    }
  };

  const handleNaverLogin = async () => {
    try {
      const urlResponse = await naverAuthUrlGetFetch();

      const naverUrl = document.createElement('a');

      naverUrl.setAttribute('href', urlResponse.data);

      naverUrl.click();
    } catch (error) {
      console.error(error);

      if (isAxiosError(error)) {
        toast({
          title: error?.response?.data.message || '네이버 로그인 실패',
          icon: <CircleXIcon />,
          className: TOAST.error,
        });
      }
    }
  };

  console.info('파라미터 확인', getValues());

  return (
    <>
      <Appbar />
      <Layout>
        <div className="w-[30rem] m-auto pt-10">
          <div className="mb-14">
            <h3 className="mb-6 text-2xl font-semibold text-center text-primary">로그인</h3>
            <p className="text-lg text-center text-gray400">이메일로 로그인</p>
          </div>

          <div>
            <Input
              control={control}
              name="email"
              type="text"
              label="이메일"
              placeholder="example@example.com"
              error={errors?.email}
            />
          </div>

          <div className="my-8">
            <Input
              control={control}
              name="password"
              type="password"
              label="비밀번호"
              placeholder="영어 대소문자, 특수문자 1자를 포함"
              error={errors?.password}
            />
          </div>

          <Button className="w-full mb-2" onClick={handleSubmit}>
            로그인
          </Button>
          <KakaoButton buttonText="카카오로 시작하기" onSubmit={handleKakaoLogin} />
          <Button
            className="flex items-center w-full gap-6 mt-2 text-white bg-green-500 hover:bg-green-600 active:bg-green-700"
            onClick={handleNaverLogin}
          >
            <img className="h-full" src="/icons/naverlogo.png" alt="naverlogo" />
            네이버로 시작하기
          </Button>

          <div className="mt-8 font-light text-center">
            아직 회원이 아니신가요?{' '}
            <span onClick={() => navigate(PATH.register)} className="ml-2 underline cursor-pointer text-blue500">
              회원가입
            </span>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Login;
