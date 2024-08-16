// recoil/locationState.ts
import {atom} from 'recoil';

export const locationState = atom({
  key: 'locationState',
  default: {
    latitude: 0, // 초기값을 0으로 설정
    longitude: 0, // 초기값을 0으로 설정
  },
});
