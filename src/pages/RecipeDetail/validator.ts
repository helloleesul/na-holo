import * as yup from 'yup';

export const commentSchema = yup.object().shape({
  content: yup.string().required('댓글을 입력해주세요!'),
});
