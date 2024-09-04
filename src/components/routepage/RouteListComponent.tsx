import React, {useEffect, useState} from 'react';
import {VStack, Text, HStack, View, Image} from 'native-base';
import {useRecoilState} from 'recoil';
import {
  ErrorState,
  LoadingState,
  RouteListState,
  selectedRouteState,
  SelectedTransportMethodState,
} from 'state/RouteAtoms';
import {useNavigation} from '@react-navigation/native';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import BusIcon from 'assets/images/whiteBusIcon.png';
import WhiteBusIcon from 'assets/images/whiteBusIcon.png';
import TransferIcon from 'assets/images/wheelchair.png';
import errorIcon from 'assets/images/wrongMap.png';

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

const CountdownTimer = ({initialSeconds}) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft(prev => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (secondsLeft <= 0) {
    return (
      <Text fontSize="16px" color="red.500">
        곧 도착
      </Text>
    );
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <Text fontSize="16px" color="red.500">
      {minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`}
    </Text>
  );
};

const RouteListComponent = () => {
  const [routeList, setRouteList] = useRecoilState(RouteListState);
  const [loading] = useRecoilState(LoadingState); // 로딩 상태
  const [error] = useRecoilState(ErrorState); // 에러 상태
  const [selectedMethod] = useRecoilState(SelectedTransportMethodState); // 선택된 대중교통 수단
  const navigation = useNavigation();
  const [, setSelectedRouteState] = useRecoilState(selectedRouteState);

  const handleRoutePress = route => {
    setSelectedRouteState(route);
    navigation.navigate('RouteTransport');
  };
  // 필터링 로직: 선택된 대중교통 수단에 따라 routeList 자체를 필터링
  const filterRoutesBySelectedMethod = () => {
    if (selectedMethod === '전체')
      return routeList.filter(route => {
        const hasWalk = route.legs.some(leg => leg.mode === 'WALK');
        const notHasTrain = route.legs.some(leg => leg.mode !== 'TRAIN');
        return hasWalk && notHasTrain;
      });

    if (selectedMethod === '버스') {
      return routeList.filter(route =>
        route.legs.every(leg => leg.mode === 'WALK' || leg.mode === 'BUS'),
      );
    }

    if (selectedMethod === '지하철') {
      return routeList.filter(route =>
        route.legs.every(leg => leg.mode === 'WALK' || leg.mode === 'SUBWAY'),
      );
    }

    if (selectedMethod === '버스+지하철') {
      return routeList.filter(route => {
        const hasBus = route.legs.some(leg => leg.mode === 'BUS');
        const hasSubway = route.legs.some(leg => leg.mode === 'SUBWAY');
        const hasWalk = route.legs.some(leg => leg.mode === 'WALK');
        return hasBus && hasSubway && hasWalk;
      });
    }

    return routeList;
  };

  const renderBusTag = route => {
    if (!route) return null; // route가 undefined 또는 null인 경우 처리

    const tagLabel = route.includes(':') ? route.split(':')[0] : route;
    if (tagLabel) {
      let bgColor = '#FFA500'; // 기본 배경색: 노란색 (간선)
      if (tagLabel.includes('지선')) bgColor = '#00C853'; // 지선: 초록색
      else if (tagLabel.includes('직행')) bgColor = '#CDCED6';
      else if (tagLabel.includes('저상')) bgColor = '#419E1A';
      else if (tagLabel.includes('일반')) bgColor = '#CDCED6'; // 일반: 빨간색
      else if (tagLabel.includes('첨단')) bgColor = '#F44336'; // 일반: 빨간색

      return <DetailTag label={tagLabel} bgColor={bgColor} textColor="white" />;
    }
    return null;
  };

  useEffect(() => {
    setRouteList(routeList);
  }, [routeList]);

  if (loading) {
    return (
      <View alignItems="center" justifyContent="center" flex={1} mt={'30%'}>
        <ActivityIndicator />
      </View>
    );
  }

  if (error) {
    return (
      <View alignItems="center" justifyContent="center" flex={1} mt={'30%'}>
        <Image source={errorIcon} alt="error" mb={'24px'} />
        <Text fontSize={'16px'} fontWeight={'medium'} color="#B9BBC6">
          {error}
        </Text>
      </View>
    );
  }

  return (
    <>
      {filterRoutesBySelectedMethod().map((item, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => handleRoutePress(item)}
          activeOpacity={0.8}>
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
                    {console.log(leg.vehicletp, leg.mode)}
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
                        {renderBusTag(
                          leg.mode === 'BUS' ? leg.vehicletp : leg.route,
                        )}
                        <Text fontSize="16px" fontWeight="medium">
                          {leg.route?.includes(':')
                            ? leg.route?.split(':')[1]
                            : leg.route}
                        </Text>
                        {leg.arrtime && (
                          <CountdownTimer initialSeconds={leg.arrtime} />
                        )}
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
