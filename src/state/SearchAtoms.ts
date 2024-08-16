import {atom} from 'recoil';

export const searchKeywordState = atom({
  key: 'SearchKeywordState',
  default: '', // 검색어의 초기값
});

export const recentSearchesState = atom({
  key: 'RecentSearchesState',
  default: [
    {
      name: '서울역',
      distance: 0.5,
      address: '서울특별시 용산구 동자동',
    },
    {
      name: '서울역',
      distance: 0.5,
      address: '서울특별시 용산구 동자동',
    },
  ], // 최근 검색 내역의 초기값
});

export const searchResultState = atom({
  key: 'SearchResultState',
  default: [
    {
      name: '서울역',
      distance: 0.5,
      address: '서울특별시 용산구 동자동',
    },
    {
      name: '서울역',
      distance: 0.5,
      address: '서울특별시 용산구 동자동',
    },
  ], // 최근 검색 내역의 초기값
});
