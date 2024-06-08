import { uploadImage } from '@/utils/uploadImage';
import { RoomSchemaType } from './RoomWrite';
import { WriteRoomPostFetchParams } from '@/api/room/writeRoomPostFetch';

/**
 * 방자랑 등록 파라미터를 포맷팅한다.
 */
export const getRoomCleansingData = async (data: RoomSchemaType) => {
  const { thumbnailUrl = [], roomImages = [], ...rest } = data;

  /**
   * 대표 이미지를 업로드하고 params 형식에 맞춘다.
   */
  const cleansingMainImage = (await Promise.all(
    thumbnailUrl.map(async (item) => {
      if (item.image instanceof File) {
        const uploadedImage = await uploadImage(item.image);
        return uploadedImage?.imageUrl;
      }
    }),
  )) as PropType<WriteRoomPostFetchParams, 'thumbnailUrl'>;

  /**
   * 방자랑 이미지들을 업로드하고 params 형식에 맞춘다.
   */
  const cleansingRoomImage = (await Promise.all(
    roomImages
      .filter((item) => item.image instanceof File)
      .map(async (item) => {
        const uploadedImage = await uploadImage(item.image);
        return uploadedImage?.imageUrl;
      }),
  )) as PropType<WriteRoomPostFetchParams, 'roomImages'>;

  return {
    ...rest,
    thumbnailUrl: cleansingMainImage[0],
    roomImages: cleansingRoomImage,
  } as WriteRoomPostFetchParams;
};