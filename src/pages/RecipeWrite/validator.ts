import * as yup from 'yup';

// yup 스키마 정의
export const RecipeSchema = yup.object().shape({
  title: yup.string().required('레시피 이름을 입력해주세요'),
  description: yup.string().required('간단한 한 줄 소개를 부탁드려요'),
  cuisine: yup.string().required('Cuisine is required'),
  recipeType: yup.string().required('Recipe type is required'),
  recipeTime: yup.string().required('Recipe time is required'),
  portions: yup.string().required('Portions is required'),
  images: yup.array().of(
    yup.object().shape({
      image: yup
        .mixed()
        .required('대표이미지를 선택해주세요!')
        .test('is-file', '대표이미지는 파일이어야 합니다!', (value) => value instanceof File),

      imageUrl: yup.string().required('대표이미지를 선택해주세요!'),
    }),
  ),
  ingredients: yup
    .array()
    .required()
    .of(
      yup.object().shape({
        name: yup.string().required('재료 이름을 입력해주세요.'),
        quantity: yup.string().required('얼마나 넣어야할까요?'),
        unit: yup.string().required('단위는 무엇인가요?'),
      }),
    ),
  details: yup.array().of(
    yup.object().shape({
      image: yup.mixed(), // Required 풀기
      imageUrl: yup.string(), // Required 풀기
      description: yup.string().required('조리 순서를 입력해주세요!'),
    }),
  ),
});
