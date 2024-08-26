import {atom} from 'recoil';

export const ShowMarkerState = atom({
  key: 'showMarkerState',
  default: [],
});

export const ShowDrawerMenuState = atom({
  key: 'showDrawerMenuState',
  default: false,
});

export const SelectedLocationState = atom({
  key: 'selectedLocationState',
  default: [],
});

export const IsActionSheetOpen = atom({
  key: 'isActionSheetOpen',
  default: false,
});
