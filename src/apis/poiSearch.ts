import Config from 'react-native-config';

const TMAP_API_KEY = Config.TMAP_API_KEY;
import axios from 'axios';

// TMAP POI 검색 API 호출 함수
export const fetchPOIResults = async (searchKeyword: string) => {
  const url = `https://apis.openapi.sk.com/tmap/pois?version=1&searchKeyword=${encodeURIComponent(
    searchKeyword,
  )}&appKey=${TMAP_API_KEY}&count=10&page=1&resCoordType=WGS84GEO&reqCoordType=WGS84GEO`;

  try {
    const response = await axios.get(url, {
      headers: {
        Accept: 'application/json',
      },
    });

    return response.data?.searchPoiInfo?.pois?.poi || [];
  } catch (error) {
    console.error('TMAP API 호출 에러:', error);
    return [];
  }
};
