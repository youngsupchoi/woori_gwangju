import React, {useEffect} from 'react';
import {VStack} from 'native-base';
import haversine from 'haversine';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
  recentSearchesState,
  searchKeywordState,
  searchResultState,
} from 'state/SearchAtoms';
import SharedSearchListComponent from 'components/searchpage/SharedSearchListComponent';
import historyIcon from '../assets/images/history.png';
import searchResultLocationIcon from '../assets/images/searchResultLocationIcon.png';
import FilterButtons from 'components/mainpage/FilterButtons';
import {fetchPOIResults} from 'apis/poiSearch';
import {locationState} from 'state/locationState';
import MainSearchBar from 'components/mainpage/MainSearchbar';

const SearchPage = () => {
  const [searchKeyword, setSearchKeyword] = useRecoilState(searchKeywordState);
  const [recentSearches] = useRecoilState(recentSearchesState);
  const [searchResult, setSearchResult] = useRecoilState(searchResultState);
  const currentLocation = useRecoilValue(locationState); // 현재 위치 가져오기

  useEffect(() => {
    if (searchKeyword) {
      // 검색어가 있을 경우 TMAP API 호출
      fetchPOIResults(searchKeyword).then(results => {
        if (currentLocation.latitude && currentLocation.longitude) {
          // 현재 위치와 각 POI 간의 거리를 계산해 추가
          const resultsWithDistance = results.map(item => {
            const distance = haversine(currentLocation, {
              latitude: item.frontLat,
              longitude: item.frontLon,
            });
            console.log(
              item.frontLat,
              item.frontLon,
              currentLocation.latitude,
              currentLocation.longitude,
            );
            return {...item, distance: distance.toFixed(1)}; // 거리 값을 km로 표시
          });
          setSearchResult(resultsWithDistance);
        } else {
          setSearchResult(results);
        }
      });
    }
  }, [searchKeyword, currentLocation]);

  return (
    <VStack flex={1} bg="white" p={0} m={0}>
      {/* 검색 바 */}

      <MainSearchBar
        showBackButton={true}
        onChangeText={text => setSearchKeyword(text)}
      />

      {/* 필터 버튼들 */}
      <FilterButtons />

      {console.log(searchResult)}
      {searchKeyword === '' ? (
        <SharedSearchListComponent
          data={recentSearches}
          iconSource={historyIcon}
          title="최근 검색"
        />
      ) : (
        <SharedSearchListComponent
          data={searchResult}
          iconSource={searchResultLocationIcon}
          highlightKeyword={searchKeyword}
        />
      )}
    </VStack>
  );
};

export default SearchPage;
