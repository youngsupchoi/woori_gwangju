// recoil/locationState.ts
import {atom} from 'recoil';

export const locationState = atom({
  key: 'locationState',
  default: {
    //TODO: 광주를 기본 위치로 변경 35.159545, 126.852601
    latitude: 37.5642135, // 현재는 서울시 중심 위치
    longitude: 127.0016985, // 현재는 서울시 중심 위치
  },
});
