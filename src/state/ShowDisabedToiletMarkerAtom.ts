// recoil/locationState.ts
import {atom} from 'recoil';

export const ShowDisabedToiletMarkerAtom = atom({
  key: 'showDisabedToiletMarkerAtom',
  default: false,
});

export const ShowToiletMarkerAtom = atom({
  key: 'showToiletMarkerAtom',
  default: false,
});
