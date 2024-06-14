import * as yup from 'yup';

import { Layout } from '@/layout';
import { Appbar } from '@/components/Appbar';
import { Footer } from '@/components/Footer';
import { memberSchema } from './validator';

import { Leave } from './components/Leave';
import { EditForm } from './components/EditForm';

export type MemberSchemaType = yup.InferType<typeof memberSchema>;

/**
 * 마이페이지 컴포넌트
 */

const Mypage = () => {
  return (
    <>
      <Appbar />
      <Layout>
        <div className="flex flex-row items-center gap-6 mb-16">
          <img src="/icons/arrow_svg_rightdown.svg" alt="arrow_icon" />
          <span className="text-xl font-semibold text-gray-800">나의 정보</span>
        </div>
        <div className="flex flex-col max-w-[53.25rem] min-w-[30rem] mx-auto">
          <EditForm />
          <Leave />
        </div>
      </Layout>
      <Footer />
    </>
  );
};

export default Mypage;
