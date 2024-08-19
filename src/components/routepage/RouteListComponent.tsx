import React from 'react';
import {VStack, Text, HStack, View, Image} from 'native-base';
import SearchResultLocationIcon from 'assets/images/searchResultLocationIcon.png';
import {useRecoilState} from 'recoil';
import {RouteListState, selectedRouteState} from 'state/RouteAtoms';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';

const RouteLocationMarker = () => (
  <VStack
    space={1}
    w={'20px'}
    mr={'10px'}
    position={'absolute'}
    top={'12px'}
    bottom={'12px'}
    alignItems={'center'}
    left={'12px'}
    flex={1}
    justifyContent={'space-between'}>
    <Image
      source={SearchResultLocationIcon}
      alt="location-marker"
      size="20px"
    />
    <View w={'2px'} flex={1} bg={'#CDCED6'} />
    <Image
      source={SearchResultLocationIcon}
      alt="location-marker"
      size="20px"
    />
  </VStack>
);

type DetailTagProps = {
  label: string;
  bgColor?: string;
  textColor?: string;
};

const DetailTag = ({
  label,
  bgColor = '#D9D9E0',
  textColor = '#80838D',
}: DetailTagProps) => (
  <View bg={bgColor} borderRadius={'4px'} py={'2px'} px={'4px'}>
    <Text fontSize="12" fontWeight="bold" color={textColor}>
      {label}
    </Text>
  </View>
);
const formatTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}시간 ${minutes}분`;
  }
  return `${minutes}분`;
};

const RouteListComponent = () => {
  const [routeList] = useRecoilState(RouteListState);
  const navigation = useNavigation();
  const [, setSelectedRouteState] = useRecoilState(selectedRouteState);
  const handleRoutePress = route => {
    setSelectedRouteState(route);
    navigation.navigate('RouteTransport');
  };
  return (
    <>
      {routeList.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => handleRoutePress(item)}>
          <VStack pt={'16px'}>
            <Text fontSize="24px" fontWeight="bold" px={4}>
              {formatTime(item.totalTime)}
            </Text>
            <HStack
              justifyContent="flex-start"
              position={'relative'}
              alignItems="center"
              borderRadius={'8px'}
              py={'12px'}
              pl={'44px'}
              px={'12px'}
              mx={'18px'}
              mt={'10px'}
              mb={'16px'}
              bg={'#F0F0F3'}>
              <RouteLocationMarker />
              <VStack space={1}>
                <HStack space={1} alignItems="center">
                  <Text fontSize="18px" color="#1C2024">
                    {item.legs[1].start.name}
                  </Text>
                  <DetailTag
                    label={
                      item.legs[1].passStopList?.stationList[0].stationID ?? ''
                    }
                  />
                </HStack>
                <HStack space={1} alignItems="center">
                  <DetailTag label="저상" bgColor="#419E1A" textColor="white" />
                  <Text fontSize="16" fontWeight="medium">
                    {item.legs[1].route}
                  </Text>
                  <Text fontSize="16" color="red.500">
                    2분 12초
                  </Text>
                </HStack>
                <HStack space={1} alignItems="center">
                  <Text fontSize="18px" color="#1C2024">
                    {item.legs[item.legs.length - 1].start.name}
                  </Text>
                  <DetailTag
                    label={
                      item.legs[1].passStopList?.stationList[
                        item.legs[1].passStopList.stationList.length - 1
                      ].stationID ?? ''
                    }
                  />
                </HStack>
              </VStack>
            </HStack>
            <View bg={'#E8E8EC'} h={'8px'} w={'full'} />
          </VStack>
        </TouchableOpacity>
      ))}
    </>
  );
};

export default RouteListComponent;
