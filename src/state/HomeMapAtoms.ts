import {atom} from 'recoil';

export const ShowMarkerState = atom({
  key: 'showMarkerState',
  default: [],
});

export const ShowDrawerMenuState = atom({
  key: 'showDrawerMenuState',
  default: false,
});
