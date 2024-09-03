import {
  Button,
  Divider,
  HStack,
  Image,
  ScrollView,
  Text,
  View,
  VStack,
} from 'native-base';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useRecoilState} from 'recoil';
import {DestinationState} from 'state/RouteAtoms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {recentSearchesState} from 'state/SearchAtoms';

const SharedSearchListComponent = ({
  isRecentSearch,
  data,
  iconSource,
  highlightKeyword = '',
  title,
}: {
  isRecentSearch?: boolean;
  data: Array<any>;
  iconSource: any;
  highlightKeyword?: string;
  title?: string;
}) => {
  const navigation = useNavigation();
  const [, setDestinationState] = useRecoilState(DestinationState);
  const [, setRecentSearches] = useRecoilState(recentSearchesState);

  const handlePress = async (item: any) => {
    // Recoil 상태에 선택된 목적지 설정
    setDestinationState({
      name: item.name,
      longitude: item.frontLon,
      latitude: item.frontLat,
      address: item.newAddressList?.newAddress[0]?.fullAddressRoad,
    });

    try {
      // 기존 최근 검색어 가져오기
      const recentSearches = await AsyncStorage.getItem('recentSearches');
      let recentSearchesArray = recentSearches
        ? JSON.parse(recentSearches)
        : [];

      // 동일한 항목이 있는지 확인하고 제거
      recentSearchesArray = recentSearchesArray.filter(
        search =>
          search.name !== item.name ||
          search.longitude !== item.frontLon ||
          search.latitude !== item.frontLat,
      );

      // 새로운 검색어를 맨 위에 추가
      recentSearchesArray.unshift({
        name: item.name,
        longitude: item.frontLon,
        latitude: item.frontLat,
        address: item.newAddressList?.newAddress[0]?.fullAddressRoad,
      });

      // 최근 검색어가 20개를 초과하면 오래된 항목 제거
      if (recentSearchesArray.length > 20) {
        recentSearchesArray = recentSearchesArray.slice(0, 20);
      }

      // 업데이트된 배열을 다시 저장
      await AsyncStorage.setItem(
        'recentSearches',
        JSON.stringify(recentSearchesArray),
      );
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }

    // SearchResultPage로 이동
    navigation.navigate('SearchResult');
  };

  const resetData = async () => {
    try {
      // AsyncStorage에서 최근 검색어 삭제
      await AsyncStorage.removeItem('recentSearches');

      // recentSearches 상태를 빈 배열로 설정하여 UI 업데이트
      setRecentSearches([]);
    } catch (error) {
      console.error('Error resetting recent searches:', error);
    }
  };

  const highlightText = (text: string = '', highlight: string = '') => {
    if (!highlight || !text.includes(highlight)) {
      return (
        <View>
          <Text fontSize={18} fontWeight={'regular'} p={0} isTruncated>
            {text}
          </Text>
        </View>
      );
    }

    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === highlight.toLowerCase() ? (
        <Text
          key={index}
          fontSize={'18px'}
          fontWeight={'regular'}
          color="blue.500"
          p={0}
          isTruncated>
          {part}
        </Text>
      ) : (
        <Text
          key={index}
          fontSize={'18px'}
          fontWeight={'regular'}
          p={0}
          m={0}
          isTruncated>
          {part}
        </Text>
      ),
    );
  };

  return (
    <View>
      <HStack w={'100%'} justifyContent={'space-between'}>
        {title ? (
          <Text fontSize="md" bold mb={2} ml={'18px'} mt={2} isTruncated>
            {title}
          </Text>
        ) : (
          <View />
        )}
        <Button onPress={resetData} variant={'ghost'}>
          <Text>재설정</Text>
        </Button>
      </HStack>
      <ScrollView>
        <View pb={'240px'}>
          {console.log(data)}
          {data?.map((item, index) => (
            <VStack key={index} space={2} mb={4}>
              <TouchableOpacity onPress={() => handlePress(item)}>
                <HStack space={2} px={4} py={2} alignItems={'flex-start'}>
                  <Image
                    source={iconSource}
                    alt="icon"
                    width={'20px'}
                    height={'20px'}
                  />
                  <VStack
                    justifyContent="space-between"
                    alignItems="flex-start"
                    flex={1}
                    w={'100%'}>
                    <HStack
                      flex={1}
                      maxW={'100%'}
                      _text={{overflow: 'hidden', ellipsizeMode: 'tail'}}>
                      <View maxW={'80%'} flexDir={'row'} overflow={'hidden'}>
                        {highlightText(item.name, highlightKeyword)}
                      </View>
                      {!isRecentSearch && item.distance && (
                        <View
                          px={2}
                          ml={2}
                          bg={'#F1F3F5'}
                          borderRadius={'sm'}
                          alignItems={'center'}
                          justifyContent={'center'}>
                          <Text
                            color="gray.500"
                            fontWeight={'semibold'}
                            fontSize={'12px'}
                            isTruncated>
                            {item.distance}km
                          </Text>
                        </View>
                      )}
                    </HStack>
                    <Text color="#889096" isTruncated>
                      {isRecentSearch
                        ? item.address
                        : item.newAddressList?.newAddress[0].fullAddressRoad}
                    </Text>
                  </VStack>
                </HStack>
              </TouchableOpacity>
              <Divider />
            </VStack>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default SharedSearchListComponent;
