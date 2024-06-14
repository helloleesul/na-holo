import { useRef, ChangeEvent } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/Input';

interface CookingOrderFieldType {
  details: {
    image: File;
    imageUrl: string;
    description: string;
  }[];
}

const CookingOrderFields = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<Pick<CookingOrderFieldType, 'details'>>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'details',
  });

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      const imageUrl = URL.createObjectURL(file);

      setValue(`details.${index}.image`, file);
      setValue(`details.${index}.imageUrl`, imageUrl);
    }
  };

  return (
    <div className="flex flex-col w-full justify-center">
      {fields.map((item, i) => (
        <div key={item.id} className="mt-8 items-center">
          <div className="flex items-center gap-4">
            {watch(`details.${i}.imageUrl`) ? (
              <img
                src={watch(`details.${i}.imageUrl`)}
                alt={`조리 순서${i + 1}`}
                className="rounded-lg w-[4rem] h-[4rem]"
              />
            ) : (
              <div
                className="bg-[#e5e7eb] rounded-lg w-[4rem] h-[4rem] opacity-90 flex items-center justify-center hover:bg-gray200 active:bg-gray300 cursor-pointer text-xs text-gray600 select-none"
                onClick={() => fileInputRefs.current[i]?.click()}
              >
                사진
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={(el) => (fileInputRefs.current[i] = el)}
              onChange={(e) => handleFileChange(e, i)}
            />
            <div className="basis-3/4">
              <Input
                name={`details.${i}.description`}
                control={control}
                type="text"
                label={`조리 순서${i + 1}`}
                placeholder="조리방법을 적어주세요!"
                error={errors?.details?.[i]?.description}
              />
            </div>

            {fields.length === i + 1 ? (
              <Button
                className="self-end"
                variant="outline"
                onClick={() => append({ image: {} as File, imageUrl: '', description: '' })}
              >
                추가
              </Button>
            ) : (
              <Button className="self-end" variant="outline" onClick={() => remove(i)}>
                삭제
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CookingOrderFields;
