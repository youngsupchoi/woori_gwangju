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
import {DestinationState, StartPointState} from 'state/RouteAtoms';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SharedSearchListComponent = ({
  isRecentSearch,
  isDestination = true,
  isReset = false,
  data,
  iconSource,
  highlightKeyword = '',
  title,
}: {
  isRecentSearch?: boolean;
  isDestination?: boolean;
  isReset?: boolean;
  data: Array<any>;
  iconSource: any;
  highlightKeyword?: string;
  title?: string;
}) => {
  const navigation = useNavigation();
  const [, setDestinationState] = useRecoilState(DestinationState);
  const [startPointState, setStartPointState] = useRecoilState(StartPointState);

  const handlePress = async (item: any) => {
    let startPoint = startPointState;

    if (isDestination) {
      setDestinationState(
        !isRecentSearch
          ? {
              name: item.name,
              longitude: item.frontLon,
              latitude: item.frontLat,
              address: item.newAddressList?.newAddress[0]?.fullAddressRoad,
            }
          : {
              name: item.name,
              longitude: item.longitude,
              latitude: item.latitude,
              address: item.address,
            },
      );
    } else {
      startPoint = !isRecentSearch
        ? {
            name: item.name,
            longitude: item.frontLon,
            latitude: item.frontLat,
            address: item.newAddressList?.newAddress[0]?.fullAddressRoad,
          }
        : {
            name: item.name,
            longitude: item.longitude,
            latitude: item.latitude,
            address: item.address,
          };
      setStartPointState(startPoint);
    }

    try {
      const recentSearches = await AsyncStorage.getItem('recentSearches');
      let recentSearchesArray = recentSearches
        ? JSON.parse(recentSearches)
        : [];

      recentSearchesArray.push(
        !isRecentSearch
          ? {
              name: item.name,
              longitude: item.frontLon,
              latitude: item.frontLat,
              address: item.newAddressList?.newAddress[0]?.fullAddressRoad,
            }
          : {
              name: item.name,
              longitude: item.longitude,
              latitude: item.latitude,
              address: item.address,
            },
      );

      await AsyncStorage.setItem(
        'recentSearches',
        JSON.stringify(recentSearchesArray),
      );
    } catch (error) {
      console.error('Error saving recent searches:', error);
    }

    // Route로 이동 시 startPoint 전달
    if (isReset) {
      navigation.navigate('Route', {startPoint});
    } else {
      navigation.navigate('SearchResult');
    }
  };

  const resetData = async () => {
    await AsyncStorage.removeItem('recentSearches');
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
      {console.log('isReset:', isReset, 'isDestination: ', isDestination)}
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
