import {atom} from 'recoil';

export const DestinationState = atom<{
  name: string;
  longitude: number;
  latitude: number;
  address: string;
}>({
  key: 'destinationState',
  default: {
    name: '',
    longitude: 0, // 기본값 설정
    latitude: 0, // 기본값 설정
    address: '',
  },
});

export const StartPointState = atom<{
  name: string;
  longitude: number;
  latitude: number;
  address: string;
}>({
  key: 'startPointState',
  default: {
    name: '',
    longitude: 0, // 기본값 설정
    latitude: 0, // 기본값 설정
    address: '',
  },
});

export const VoiceNavigationState = atom({
  key: 'voiceNavigationState',
  default: false,
});

export const SelectedMethodState = atom({
  key: 'selectedMethodState',
  default: '휠체어',
});

export const SelectedTransportMethodState = atom({
  key: 'selectedTransportMethodState',
  default: '전체',
});

export const selectedRouteState = atom({
  key: 'selectedRouteState',
  default: {},
});

export const RouteListState = atom({
  key: 'routeListState',
  default: [],
});

export const LoadingState = atom({
  key: 'LoadingState',
  default: false,
});

export const ErrorState = atom({
  key: 'ErrorState',
  default: null,
});
