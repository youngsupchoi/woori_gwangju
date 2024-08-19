import React from 'react';
import {VStack, Text, HStack, View, Image} from 'native-base';
import {useRecoilState} from 'recoil';
import {RouteListState, selectedRouteState} from 'state/RouteAtoms';
import {useNavigation} from '@react-navigation/native';
import {TouchableOpacity} from 'react-native';
import BusIcon from 'assets/images/whiteBusIcon.png';
import WhiteBusIcon from 'assets/images/whiteBusIcon.png';
import TransferIcon from 'assets/images/wheelchair.png';

const RouteLocationMarker = ({leg}) => {
  const backgroundColor = leg.routeColor ? `#${leg.routeColor}` : '#CDCED6';
  const iconSource =
    leg.mode === 'BUS'
      ? BusIcon
      : leg.mode === 'SUBWAY'
      ? WhiteBusIcon
      : TransferIcon;

  return (
    <VStack
      space={1}
      w={'20px'}
      h={'100%'}
      mr={'10px'}
      position={'absolute'}
      top={'8px'}
      bottom={'0px'}
      alignItems={'center'}
      left={'4px'}
      flex={1}
      justifyContent={'space-between'}>
      <View
        w={'24px'}
        h={'24px'}
        bg={backgroundColor}
        justifyContent="center"
        alignItems="center"
        borderRadius="full">
        <Image source={iconSource} alt="transport-icon" size="12px" />
      </View>
      {<View w={'2px'} flex={1} bg={backgroundColor} />}
    </VStack>
  );
};

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

  const renderBusTag = route => {
    const tagLabel = route.includes(':') ? route.split(':')[0] : null;
    if (tagLabel) {
      let bgColor = '#FFA500'; // 기본 배경색: 노란색 (간선)
      if (tagLabel === '지선') bgColor = '#00C853'; // 지선: 초록색
      else if (tagLabel === '직행좌석') bgColor = '#CDCED6';
      else if (tagLabel === '저상') bgColor = '#419E1A';
      else if (tagLabel === '일반') bgColor = '#F44336'; // 일반: 빨간색

      return <DetailTag label={tagLabel} bgColor={bgColor} textColor="white" />;
    }
    return null;
  };

  return (
    <>
      {routeList.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => handleRoutePress(item)}>
          <VStack pt={'16px'}>
            <Text fontSize="24px" fontWeight="bold" px={4}>
              {formatTime(item.totalTime)}
            </Text>
            <VStack
              justifyContent="flex-start"
              position={'relative'}
              alignItems="flex-start"
              borderRadius={'8px'}
              space={2}
              py={'12px'}
              px={'12px'}
              mx={'18px'}
              mt={'10px'}
              mb={'16px'}
              pb={'16px'}
              bg={'#F0F0F3'}>
              {item.legs
                .filter(leg => leg.mode !== 'WALK')
                .map((leg, i) => (
                  <VStack
                    space={1}
                    key={i}
                    alignItems={'center'}
                    justifyContent={'center'}>
                    <RouteLocationMarker leg={leg} />
                    <VStack space={1} ml={'36px'}>
                      <HStack
                        space={1}
                        alignItems="center"
                        w={'100%'}
                        maxW={'100%'}>
                        <Text
                          fontSize="18px"
                          color="#1C2024"
                          isTruncated
                          maxW={'80%'}>
                          {i === 0
                            ? `${leg.start.name} 출발`
                            : `${leg.start.name} 환승`}
                        </Text>
                        <DetailTag
                          label={
                            leg.passStopList?.stationList[0].stationID ?? ''
                          }
                        />
                      </HStack>
                      <HStack space={1} alignItems="center">
                        {renderBusTag(leg.route)}
                        <Text fontSize="16px" fontWeight="medium">
                          {leg.route?.includes(':')
                            ? leg.route?.split(':')[1]
                            : leg.route}
                        </Text>
                        <Text fontSize="16px" color="red.500">
                          {Math.ceil(leg.sectionTime / 60)}분
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                ))}

              {/* 도착 정보 */}
              <VStack space={1} alignItems={'center'} justifyContent={'center'}>
                <RouteLocationMarker leg={item.legs[item.legs.length - 1]} />
                <VStack ml={'36px'}>
                  <HStack space={1} alignItems="center">
                    <Text fontSize="18px" color="#1C2024">
                      {item.legs[item.legs.length - 1].start.name} 도착
                    </Text>
                  </HStack>
                </VStack>
              </VStack>
            </VStack>
            <View bg={'#E8E8EC'} h={'8px'} w={'full'} />
          </VStack>
        </TouchableOpacity>
      ))}
    </>
  );
};

export default RouteListComponent;
