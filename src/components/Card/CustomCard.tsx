import { MouseEventHandler, ReactNode } from 'react';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

import { Heart } from 'lucide-react';

export interface CustomCardPropsType {
  className?: string;
  /**
   * 카드제목
   */
  title?: string;

  /**
   * 카드내용
   */
  description?: string;

  /**
   * 없으면 텍스트 카드
   */
  imageUrl?: string;

  /**
   * 유저이름
   */
  userName?: string;

  /**
   * 유저 프로필이미지
   */
  userImage?: string;

  /**
   * n줄 효과
   */
  lineClamp?: 1 | 2;

  /**
   * 좋아요 갯수
   */
  likes?: number;

  /**
   * price || date slot
   */
  slot?: ReactNode | ReactNode[];

  /**
   * @todo 나중에 옵셔널 풀어준다.
   */
  onPageMove?: MouseEventHandler;
}

/**
 * 테일윈드 background url 속성이 안먹어서 일단은 인라인 스타일로 처리했습니다..
 */
const CustomCard = (props: CustomCardPropsType) => {
  const { className, title, description, userName, userImage, imageUrl, lineClamp, likes, slot, onPageMove } = props;

  return (
    <Card
      className={`w-[300px] m-auto cursor-pointer transition-all duration-300 ease  hover:shadow-xl box-border ${className}`}
      onClick={onPageMove}
    >
      <CardHeader
        className={`relative rounded-t-lg p-1 ${
          imageUrl ? `h-56 bg-[url('${imageUrl}')] bg-cover bg-no-repeat grid place-items-center` : 'hidden'
        }`}
        style={{
          backgroundImage: imageUrl
            ? `url('${!imageUrl.includes('http') ? '/images/no_image.jpeg' : imageUrl}')`
            : 'none',
        }}
      >
        {imageUrl ? (
          <div className="flex gap-1 items-center rounded-2xl bg-gray400 opacity-70 px-2 py-1 mt-auto ml-auto">
            <Heart fill="#fff" stroke="#fff" className="w-3 h-3" />
            <span className="text-white font-extralight text-sm">{likes}</span>
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="py-2 px-3 box-border">
        <h3 className="mb-2 text-lg font-semibold truncate">{title}</h3>

        {description && (
          <p className={`text-md text-gray500 max-w-xs mb-4  ${lineClamp === 1 ? 'truncate' : 'line-clamp-2'}`}>
            {description}
          </p>
        )}

        <div className="mb-2">{slot}</div>
        {userName ? <Separator /> : null}
      </CardContent>
      <CardFooter className="flex items-center gap-2 pb-2 px-3">
        {userName ? (
          <div className="flex items-center gap-2">
            <Avatar className="w-4 h-4">
              <AvatarImage src={userImage ? userImage : 'https://github.com/shadcn.png'} alt="@shadcn" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="font-extralight text-sm">{userName}</span>
          </div>
        ) : null}

        {!imageUrl ? (
          <div className="flex gap-1 items-center rounded-2xl bg-gray400 opacity-70 px-2 py-1 mt-auto ml-auto">
            <Heart fill="#fff" stroke="#fff" className="w-3 h-3" />
            <span className="text-white font-extralight text-sm">{likes}</span>
          </div>
        ) : null}
      </CardFooter>
    </Card>
  );
};

export default CustomCard;
