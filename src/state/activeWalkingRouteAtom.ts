import {PedestrianRouteResponse} from 'apis/getWalkingRoute';
import {atom} from 'recoil';

export const routeInfoHeightState = atom({
  key: 'routeInfoHeightState', // 고유한 키를 설정합니다.
  default: 200, // 기본 높이를 설정합니다.
});

// 음성 경로 안내 활성화 여부
export const VoiceGuideAtom = atom({
  key: 'voiceGuideState',
  default: true,
});

export const mapZoomLevelAtom = atom<number>({
  key: 'mapZoomLevelAtom',
  default: 10, // 초기 줌 레벨 값 (필요에 따라 설정)
});

export const walkingRouteAtom = atom<PedestrianRouteResponse>({
  key: 'walkingRouteAtom',
  default: {
    type: 'FeatureCollection',
    features: [],
  },
});
