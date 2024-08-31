// src/api/searchWalkingRoute.ts
import axios from 'axios';
import sktAxiosInstance from 'apis/sktAxiosInstance';

// 요청에 사용될 데이터의 타입을 정의합니다.
export interface PedestrianRouteRequest {
  startX: number; // 필수
  startY: number; // 필수
  angle?: number; // 선택, 기본값 20
  speed?: number; // 선택, 기본값 30
  endPoiId?: string; // 선택, 기본값 "10001"
  endX: number; // 필수
  endY: number; // 필수
  passList?: string; // 선택, 기본값 제공
  reqCoordType?: string; // 선택, 기본값 "WGS84GEO"
  startName: string; // 필수
  endName: string; // 필수
  searchOption?: string; // 선택, 기본값 "0"
  resCoordType?: string; // 선택, 기본값 "WGS84GEO"
  sort?: string; // 선택, 기본값 "index"
}

// 에러 응답 데이터의 타입을 정의합니다.
export interface ApiErrorResponse {
  error: {
    id: string;
    category: string;
    code: string;
    message: string;
  };
}

// 응답 데이터의 타입을 정의합니다.
export interface PedestrianRouteResponse {
  // 실제 API의 응답 데이터 구조에 맞게 타입을 정의해야 합니다.
  // 예시:
  type: string;
  features: any[];
}

export const getWalkingRoute = async (
  routeData: PedestrianRouteRequest,
  version: number, // 필수 쿼리 파라미터
  callback?: string, // 선택 쿼리 파라미터
): Promise<PedestrianRouteResponse> => {
  console.log('🚀 ~ routeData:', routeData);
  try {
    const response = await sktAxiosInstance.post<PedestrianRouteResponse>(
      '/tmap/routes/pedestrian', // URL을 수정하여 기본 경로를 명확히 함
      {
        ...routeData,
        reqCoordType: 'WGS84GEO',
        resCoordType: 'WGS84GEO',
        sort: 'index',
        searchOption: '0',
      }, // 요청 데이터
      {
        params: {
          version, // 필수 쿼리 파라미터
          callback, // 선택 쿼리 파라미터
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // 서버에서 반환한 에러 응답 데이터 처리
        const apiError: ApiErrorResponse = error.response.data;
        console.error('Error ID:', apiError.error.id);
        console.error('Error Category:', apiError.error.category);
        console.error('Error Code:', apiError.error.code);
        console.error('Error Message:', apiError.error.message);
      } else if (error.request) {
        // 요청이 이루어졌으나 응답을 받지 못한 경우
        console.error('No response received:', error.request);
      } else {
        // 요청 설정 중에 발생한 에러
        console.error('Error setting up request:', error.message);
      }
    } else {
      // Axios 외의 에러 처리
      console.error('Unexpected error:', error);
    }
    return {
      type: 'FeatureCollection',
      features: [],
    };
    throw error;
  }
};
