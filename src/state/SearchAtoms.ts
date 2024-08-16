import {atom} from 'recoil';

export const recentSearchesState = atom({
  key: 'RecentSearchesState',
  default: [
    {
      name: '서울역',
      distance: 0.5,
      address: '서울특별시 용산구 동자동',
    },
  ], // 최근 검색 내역의 초기값
});
