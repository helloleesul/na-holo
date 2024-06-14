import dayjs from 'dayjs';
import { MemberSchemaType } from './Mypage';
import { uploadImage } from '@/utils/uploadImage';

/**
 * 회원정보수정 fetch 파라미터를 포맷팅한다.
 */
export const patchMemberDataCleansing = async (data: MemberSchemaType) => {
  const { image, birth, ...rest } = data;

  const cleansingImage = await uploadImage(image.image as File);

  return {
    ...rest,
    imageUrl: cleansingImage?.imageUrl,
    birth: dayjs(birth).format('YYYY-MM-DD'),
  };
};

/**
 * 회원정보(생년월일)의 초기값을 포맷팅한다.
 */
export const birthDateCleansing = (birth: string) => {
  return dayjs(birth).format('YYYYMMDD');
};
