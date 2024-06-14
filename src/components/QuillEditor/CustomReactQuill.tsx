import { forwardRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

/**
 * ReactHookForm 과 같이 사용하기 위한 ReactQuill 컴포넌트
 *
 * @example
 * <QuillEditor ref={quillRef} modules={modules} placeholder="내용을 입력해주세요." />
 */
const CustomReactQuill = forwardRef<ReactQuill, ReactQuillProps>(({ modules, placeholder }, ref) => {
  const { control } = useFormContext();

  return (
    <Controller
      name="content"
      control={control}
      render={({ field: { value, onChange } }) => (
        <ReactQuill
          placeholder={placeholder}
          modules={modules}
          theme="snow"
          className="h-full [&>*]:bg-white"
          ref={ref}
          value={value}
          onChange={onChange}
        />
      )}
    />
  );
});

CustomReactQuill.displayName = 'CustomReactQuill';

export default CustomReactQuill;
