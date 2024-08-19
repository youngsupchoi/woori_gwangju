import {atom} from 'recoil';

export const StartPointState = atom({
  key: 'startPointState',
  default: {
    name: '송파구민회관',
    longitude: 126.96402267,
    latitude: 37.55487196,
    address: '서울 송파구 송파대로 111',
  },
});

export const DestinationState = atom({
  key: 'destinationState',
  default: {
    name: '서울역',
    longitude: 126.972,
    latitude: 37.553,
    address: '서울 용산구 한강대로 405',
  },
});

export const SelectedMethodState = atom({
  key: 'selectedMethodState',
  default: '대중교통',
});
