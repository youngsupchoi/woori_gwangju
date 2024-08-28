import React, {useEffect} from 'react';
import {View, VStack} from 'native-base';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchPage = () => {
  const [searchKeyword, setSearchKeyword] = useRecoilState(searchKeywordState);
  const [recentSearches, setRecentSearches] =
    useRecoilState(recentSearchesState);
  const [searchResult, setSearchResult] = useRecoilState(searchResultState);
  const currentLocation = useRecoilValue(locationState); // 현재 위치 가져오기

  const handleRecentSearches = async () => {
    try {
      const recentSearch = await AsyncStorage.getItem('recentSearches');
      if (recentSearch) {
        // JSON 파싱 후 상태에 저장
        setRecentSearches(JSON.parse(recentSearch));
      } else {
        setRecentSearches([]); // 비어있으면 빈 배열로 설정
      }
    } catch (error) {
      console.error('Error fetching recent searches:', error);
      setRecentSearches([]); // 에러 발생 시에도 빈 배열로 설정
    }
  };

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
            return {...item, distance: distance.toFixed(1)}; // 거리 값을 km로 표시
          });
          setSearchResult(resultsWithDistance);
        } else {
          setSearchResult(results);
        }
      });
    }
  }, [searchKeyword, currentLocation]);

  useEffect(() => {
    handleRecentSearches(); // 최근 검색 내역 로드
  }, []);

  return (
    <VStack flex={1} bg="white" p={0} m={0}>
      {/* 검색 바 */}
      <MainSearchBar
        showBackButton={true}
        onChangeText={text => setSearchKeyword(text)}
      />

      {/* 필터 버튼들 */}
      <FilterButtons />

      <View flex={1}>
        {searchKeyword === '' && recentSearches.length !== 0 ? (
          <SharedSearchListComponent
            isRecentSearch={true}
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
      </View>
    </VStack>
  );
};

export default SearchPage;
