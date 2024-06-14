import { useRef, ChangeEvent } from 'react';
import { FieldError, useForm } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Input } from '@/components/Input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AddressSearch } from '@/pages/Register/AddressSearch';

import { memberSchema } from '../../validator';
import { useUserStore } from '@/store/useUserStore';
import { useMemberInfoMutation } from '@/services/member/useMemberInfoMutation';
import { birthDateCleansing } from '../../util';
import { patchMemberDataCleansing } from '../../util';

export type MemberSchemaType = yup.InferType<typeof memberSchema>;

/**
 * 회원 정보 수정 폼 컴포넌트
 */

const EditForm = () => {
  const name = useUserStore((state) => state.name) as string;
  const email = useUserStore((state) => state.email) as string;
  const firstAddress = useUserStore((state) => state.firstAddress) as string;
  const secondAddress = useUserStore((state) => state.secondAddress) as string;
  const imageUrl = useUserStore((state) => state.imageUrl) as string;
  const birth = useUserStore((state) => state.birth) as string;

  const method = useForm<MemberSchemaType>({
    resolver: yupResolver(memberSchema),
    defaultValues: {
      image: { image: null, imageUrl: imageUrl },
      name: name,
      email: email,
      birth: !birth ? birthDateCleansing(birth) : '',
      firstAddress: firstAddress,
      secondAddress: secondAddress,
    },
  });

  const {
    handleSubmit: submit,
    control,
    setValue,
    getValues,
    clearErrors,
    watch,
    formState: { isSubmitting, errors },
  } = method;

  const values = watch();

  const { mutate } = useMemberInfoMutation();

  const handleSubmit = submit(async () => {
    const params = await patchMemberDataCleansing(getValues());

    mutate(params);
  });

  const uploadRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = () => {
    uploadRef.current?.click();
    clearErrors('image');
  };

  const handleRemoveImage = () => {
    setValue(`image.image`, null);
    setValue(`image.imageUrl`, null);
    clearErrors('image');
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { files = [] } = e.target;

    if (files && files.length > 0) {
      const uploadFile = files[0];
      setValue(`image.image`, uploadFile);

      const imageUrl = URL.createObjectURL(uploadFile);
      setValue(`image.imageUrl`, imageUrl);
    }
  };

  const handleChangeAddress = (addr: string) => {
    setValue('firstAddress', addr);

    if (errors?.firstAddress) {
      clearErrors('firstAddress');

      return;
    }
  };

  return (
    <form className="flex flex-col text-gray-600 border-b-[0.063rem] border-gray-200" onSubmit={handleSubmit}>
      <div className="flex flex-col w-full gap-9">
        <div className="flex flex-col w-48">
          <Label className="mb-2" htmlFor="img">
            프로필 이미지
          </Label>
          <Avatar className="w-[6.25rem] h-[6.25rem] my-4">
            <AvatarImage src={values.image.imageUrl || 'https://github.com/shadcn.png'} alt="프로필 이미지" />
            <AvatarFallback>nickname state</AvatarFallback>
          </Avatar>
          <div className="flex flex-row gap-1">
            <Button type="button" variant="outline" onClick={handleUploadImage}>
              이미지 변경
            </Button>
            <input ref={uploadRef} className="hidden" accept="image/*" type="file" onChange={handleFileChange} />
            <Button type="button" variant="ghost" onClick={handleRemoveImage}>
              삭제
            </Button>
          </div>
        </div>

        <Input name="name" value={values.name} control={control} type="text" label="닉네임" error={errors?.name} />
        <Input
          name="birth"
          value={values.birth}
          control={control}
          type="text"
          extractNumber={true}
          label="생년월일"
          placeholder="YYYYMMDD"
          maxLength={8}
          error={errors?.birth}
        />
        <Input
          name="email"
          value={values.email}
          control={control}
          type="email"
          extractNumber={false}
          label="이메일"
          placeholder="example@example.com"
          error={errors?.email}
          readOnly
        />
        <AddressSearch
          name="firstAddress"
          lastName="secondAddress"
          control={control}
          errors={errors?.firstAddress as FieldError}
          onAddressChange={handleChangeAddress}
        />
      </div>

      <div className="ml-auto my-9">
        <Button type="submit" disabled={isSubmitting}>
          변경 사항 저장
        </Button>
      </div>
    </form>
  );
};

export default EditForm;
