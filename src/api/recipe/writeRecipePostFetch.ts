import { apiFetch } from '../common';
import { ResponseModel } from '../model';

export interface WriteRecipePostFetchParams {
  /**
   * 레시피 이름
   */
  title: string;

  /**
   * 간단한 한줄 소개
   */
  description: string;

  /**
   * 인원 수
   */
  portions: number;

  /**
   * 레시피 유형
   * - 시간이 없어요.. 어떤 리터럴인지 constants 봐주세요..
   */
  recipeType: string;

  /**
   * 조리 시간.
   * - 22..
   */
  recipeTime: string;

  /**
   * 어디 나라 음식?
   * - 22..
   */
  cuisine: string;

  /**
   * 메인 이미지 배열
   */
  images: {
    /**
     * 날짜 + uuid 조합의 파일명
     */
    fileName: string;
    /**
     * 스토리지에 업로드하고 반환받은 url
     */
    imageUrl: string;
  }[];

  /**
   * 재료들
   */
  ingredients: {
    /**
     * 재료 이름
     */
    name: string;
    /**
     * 수량
     */
    quantity: number;
    /**
     * 인풋 받는 단위
     */
    unit: string;
  }[];

  /**
   * 조리 순서 배열
   */
  details: {
    /**
     * 조리 설명
     */
    description: string;
    /**
     * 날짜 + uuid 조합 파일명
     */
    fileName?: string;
    /**
     * 스토리지에 업로드하고 반환받은 이미지 url
     */
    imageUrl?: string;
  }[];
}

export interface WriteRecipeResponse extends ResponseModel {}

/**
 * 레시피 작성 및 등록
 */
export const writeRecipePostFetch = (params: WriteRecipePostFetchParams) =>
  apiFetch.post<WriteRecipeResponse>('/recipes', params);
