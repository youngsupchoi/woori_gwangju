import React, {useEffect} from 'react';
import {VStack, HStack, Button, Input, Image} from 'native-base';
import haversine from 'haversine';
import {useRecoilState, useRecoilValue} from 'recoil';
import {
  recentSearchesState,
  searchKeywordState,
  searchResultState,
} from 'state/SearchAtoms';
import {useNavigation} from '@react-navigation/native';
import LeftChevron from '../assets/images/leftChevron.png';
import micIcon from '../assets/images/mic.png';
import SharedSearchListComponent from 'components/searchpage/SharedSearchListComponent';
import historyIcon from '../assets/images/history.png';
import searchResultLocationIcon from '../assets/images/searchResultLocationIcon.png';
import FilterButtons from 'components/mainpage/FilterButtons';
import {fetchPOIResults} from 'apis/poiSearch';
import {locationState} from 'state/locationState';

const SearchPage = () => {
  const navigation = useNavigation();
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
            return {...item, distance: distance.toFixed(2)}; // 거리 값을 km로 표시
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
      <HStack alignItems="center" px={4} pt={4}>
        <Button variant="ghost" onPress={() => navigation.goBack()}>
          <Image source={LeftChevron} alt="back" width={'8'} height={'8'} />
        </Button>
        <Input
          placeholder="장소/주소 검색"
          width="85%"
          bg="gray.100"
          pl={5}
          borderRadius="full"
          py={3}
          px={3}
          h={'56px'}
          fontSize="18"
          fontWeight={'bold'}
          placeholderTextColor={'gray.400'}
          color={'gray.400'}
          borderColor={'gray.100'}
          onChange={e => setSearchKeyword(e.nativeEvent.text)}
          _focus={{
            borderColor: 'gray.100',
            backgroundColor: 'white',
          }}
          InputRightElement={
            <Button borderRadius={'full'} mr={2} bg={'gray.200'}>
              <Image
                source={micIcon}
                style={{width: 24, height: 24}}
                alt="mic"
              />
            </Button>
          }
        />
      </HStack>

      {/* 필터 버튼들 */}
      <FilterButtons />

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
