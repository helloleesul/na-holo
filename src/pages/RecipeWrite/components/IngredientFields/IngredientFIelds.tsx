import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/Input';

interface IngredientFieldsType {
  ingredients: {
    name: string;
    quantity: string;
    unit: string;
  }[];
}

const IngredientFields = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Pick<IngredientFieldsType, 'ingredients'>>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients',
  });

  return (
    <div className="flex flex-col w-full justify-center">
      {fields.map((item, i) => (
        <div key={item.id} className="mt-8 items-center">
          <div className="flex items-center gap-4">
            <Input
              name={`ingredients.${i}.name`}
              control={control}
              type="text"
              label="재료"
              placeholder="재료명"
              error={errors?.ingredients?.[i]?.name}
            />
            <Input
              name={`ingredients.${i}.quantity`}
              control={control}
              type="text"
              label="수량"
              placeholder="수량"
              extractNumber={true}
              error={errors?.ingredients?.[i]?.quantity}
            />
            <Input
              name={`ingredients.${i}.unit`}
              control={control}
              type="text"
              label="단위"
              placeholder="단위명"
              error={errors?.ingredients?.[i]?.unit}
            />
            {fields.length === i + 1 ? (
              <Button
                className="self-end"
                variant="outline"
                onClick={() => append({ name: '', quantity: '', unit: '' })}
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

export default IngredientFields;
