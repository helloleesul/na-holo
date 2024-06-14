import { useMemo, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { CircleCheck, CircleXIcon, Undo2 } from 'lucide-react';
import ReactQuill from 'react-quill';
import * as yup from 'yup';

import { Appbar } from '@/components/Appbar';
import { Spinner } from '@/components/Spinner';
import { Button } from '@/components/ui/button';
import { Layout } from '@/layout';
import { ListTitle } from '../Main/components/ListTitle';

import { PATH } from '@/constants/paths';
import { Input } from '@/components/Input';
import { QuillEditor } from '@/components/QuillEditor';

import { talkSchema } from './validator';
import { yupResolver } from '@hookform/resolvers/yup';
import { writeTalkPostFetch } from '@/api/talk/writeTalkPostFetch';
import { isAxiosError } from 'axios';
import { useToast } from '@/hooks/useToast';
import { TOAST } from '@/constants/toast';
import { useNavigate } from 'react-router-dom';
import { talkPatchFetch } from '@/api/talk/talkPatchFetch';
import { useTalkDetailQuery } from '@/services/talk/useTalkDetailQuery';

export type TalkSchemaType = yup.InferType<typeof talkSchema>;

/**
 * 혼잣말 작성 페이지
 *
 */
const TalkWrite = () => {
  const [displaySpinner, setDisplaySpinner] = useState<boolean>(false);

  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const talkId = searchParams.get('id') ?? '';

  const { data: talkData } = useTalkDetailQuery({ id: talkId });

  const { toast } = useToast();

  const method = useForm({
    resolver: yupResolver(talkSchema),
    defaultValues: {
      title: talkId ? talkData?.title : '',
      content: talkId ? talkData?.content : '',
      tags: [
        {
          tagName: '',
        },
      ],
    },
  });

  const {
    handleSubmit: submit,
    control,
    getValues,
    formState: { errors },
  } = method;

  const quillRef = useRef<ReactQuill>(null);

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }, 'link'],
        ],
      },
    };
  }, []);

  const handleSubmit = submit(async () => {
    try {
      setDisplaySpinner(true);
      const writeTalkParams = await getValues();
      const id = talkId ? parseInt(talkId, 10) : null;
      const params = { ...writeTalkParams, id };
      const response = talkId ? await talkPatchFetch(params) : await writeTalkPostFetch(writeTalkParams);

      toast({
        title: talkId ? '혼잣말을 수정했어요!' : '혼잣말을 등록했어요!',
        icon: <CircleCheck />,
        className: TOAST.success,
      });

      navigate(`${PATH.talk}/${response.data.id}`);
    } catch (error) {
      console.error(error);

      if (isAxiosError(error)) {
        setDisplaySpinner(false);

        toast({
          title: error?.response?.data.message || '혼잣말 등록 실패',
          icon: <CircleXIcon />,
          className: TOAST.error,
        });
      }
    }
  });

  const loadingText = talkId ? '혼잣말을 수정 중 이에요 ...' : '혼잣말을 등록 중 이에요 ...';
  const submitBtnText = talkId ? '수정하기' : '등록하기';
  const titleText = talkId ? '혼잣말 수정 중이에요 ...' : '혼잣말 작성 중이에요 ...';

  return (
    <>
      {displaySpinner ? <Spinner>{loadingText}</Spinner> : null}
      <Appbar />
      <Layout>
        <>
          <Button
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => (talkId ? navigate(-1) : navigate(PATH.talk))}
          >
            <Undo2 />
            <span className="text-xl">돌아갈래요</span>
          </Button>
          <div className="-mt-8">
            <ListTitle imgPath="/icons/single_ment.png" title={titleText} />
          </div>
          <FormProvider {...method}>
            <div className="container w-11/12 mx-auto flex justify-between">
              <div className="w-full mb-8">
                {/* 제목 */}
                <div className="mt-8">
                  <Input
                    control={control}
                    name="title"
                    type="text"
                    label="혼잣말 제목"
                    placeholder="혼잣말 제목을 입력해주세요."
                    error={errors?.title}
                    defaultValue={talkData?.title}
                  />
                </div>

                {/* 내용 */}
                <div className="mt-8 h-72">
                  <QuillEditor ref={quillRef} modules={modules} placeholder="혼잣말 내용을 입력해주세요." />
                  {errors?.content ? (
                    <p className="mt-16 text-sm text-red-600 text-left">{errors?.content.message}</p>
                  ) : null}
                </div>

                {/* 등록 버튼 */}
                <div className="mt-20 text-center">
                  <Button className="rounded-lg w-24 text-lg" onClick={handleSubmit}>
                    {submitBtnText}
                  </Button>
                </div>
              </div>
            </div>
          </FormProvider>
        </>
      </Layout>
    </>
  );
};

export default TalkWrite;
