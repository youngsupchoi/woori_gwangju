import {useState, useEffect} from 'react';
import {useRecoilState} from 'recoil';
import {walkingRouteAtom} from 'state/activeWalkingRouteAtom';
import Config from 'react-native-config';
import axios from 'axios';

interface RouteParams {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  passList?: string;
  speed?: number;
  angle?: number;
  startName: string;
  endName: string;
  searchOption?: string;
  reqCoordType?: string;
  resCoordType?: string;
  sort?: string;
}
interface RouteResponse {
  type: string;
  features: any[];
  [key: string]: any;
}

const TMAP_API_KEY: string = Config.TMAP_API_KEY || '';

export const useSearchWalkingRoute = (params: RouteParams) => {
  const [routeData, setRouteData] = useRecoilState(walkingRouteAtom); // Atom과 연결
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post<RouteResponse>(
          'https://apis.openapi.sk.com/tmap/routes/pedestrian',
          {
            startX: params.startX,
            startY: params.startY,
            endX: params.endX,
            endY: params.endY,
            passList: params.passList || '',
            speed: params.speed || 30,
            angle: params.angle || 20,
            // startName과 endName을 URL 인코딩 처리
            startName: encodeURIComponent(params.startName),
            endName: encodeURIComponent(params.endName),
            searchOption: params.searchOption || '0',
            reqCoordType: params.reqCoordType || 'WGS84GEO',
            resCoordType: params.resCoordType || 'WGS84GEO',
            sort: params.sort || 'index',
          },
          {
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              appKey: TMAP_API_KEY,
            },
            params: {
              version: '1',
              callback: 'function',
            },
          },
        );
        console.log('🚀 ~ useSearchWalkingRoute ~ error:', response);
        setRouteData(response.data); // Recoil Atom에 데이터 저장
      } catch (err: any) {
        setError(err.message || '경로 검색 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, []);

  return {routeData, loading, error};
};
