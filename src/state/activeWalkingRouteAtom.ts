import {atom} from 'recoil';

export const routeInfoHeightState = atom({
  key: 'routeInfoHeightState', // 고유한 키를 설정합니다.
  default: 200, // 기본 높이를 설정합니다.
});
