import { ChevronDown } from 'lucide-react';

import { Layout } from '@/layout';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

import { List } from './Li';
import { ProfileDropdown } from './ProfileDropdown';

import { useUserStore } from '@/store/useUserStore';

import { useDisclosure } from '@/hooks/useDisclosure';
import { usePageMoveHandler } from '@/hooks/usePageMoveHandler';

import { PATH } from '@/constants/paths';

/**
 * 전체 페이지에서 쓰이는 header 컴포넌트
 */
const Appbar = () => {
  const accessToken = useUserStore((state) => state.accessToken);
  const name = useUserStore((state) => state.name);
  const imgUrl = useUserStore((state) => state.imageUrl);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = usePageMoveHandler();

  return (
    <Layout>
      <div className="flex items-center justify-between py-4 mb-12 select-none row header">
        <div className="flex items-center header-left">
          <h1 className="cursor-pointer" onClick={() => navigate(PATH.root)}>
            <span className="block indent-[-9999px] absolute">나홀로 집에서(자취 커뮤니티)</span>
            <img className="w-[4rem] h-[4rem]" src="/icons/logo_svg_square.svg" alt="프로젝트 로고" />
          </h1>
          <nav className="ml-10">
            <ul className="flex items-center gap-4">
              <List path={PATH.recipe} onPageMove={() => navigate(PATH.recipe)}>
                레시피
              </List>
              <List path={PATH.room} onPageMove={() => navigate(PATH.room)}>
                방자랑
              </List>
              <List path={PATH.talk} onPageMove={() => navigate(PATH.talk)}>
                혼잣말
              </List>
            </ul>
          </nav>
        </div>
        <div className="header-right">
          <ul className="flex items-center justify-center">
            {accessToken ? (
              <>
                <li>
                  <div className="relative flex items-center gap-2 cursor-pointer" onClick={isOpen ? onClose : onOpen}>
                    <Avatar>
                      <AvatarImage src={imgUrl || 'https://github.com/shadcn.png'} alt="프로필 이미지" />
                      <AvatarFallback>nickname state</AvatarFallback>
                    </Avatar>
                    <ChevronDown
                      className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </li>
                <li>
                  <ProfileDropdown isOpen={isOpen} onOpenChange={onClose} userName={name} />
                </li>
              </>
            ) : (
              <>
                <List onPageMove={() => navigate(PATH.login)}>
                  <Button>
                    <span className="text-lg">로그인</span>
                  </Button>
                </List>
                <li className="h-4">
                  <Separator className="bg-gray700" orientation="vertical" />
                </li>
                <List onPageMove={() => navigate(PATH.register)}>
                  <span className="text-lg text-gray400">회원가입</span>
                </List>
              </>
            )}
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Appbar;
