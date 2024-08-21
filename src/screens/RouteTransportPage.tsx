import React, {useEffect, useRef, useState} from 'react';
import {
  VStack,
  HStack,
  Button,
  Text,
  Image,
  View,
  ScrollView,
  IconButton,
  Collapse,
} from 'native-base';
import MapView, {Circle, Marker, Polyline} from 'react-native-maps';
import {useRecoilState, useRecoilValue} from 'recoil';
import {selectedRouteState, VoiceNavigationState} from 'state/RouteAtoms';
import {Dimensions, PanResponder} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import LeftChevron from 'assets/images/leftChevron.png';
import CloseIcon from 'assets/images/closeIcon.png';
import wheelchairIcon from 'assets/images/wheelchair.png';
import whiteBusIcon from 'assets/images/whiteBusIcon.png';
import hamburgerMenuIcon from 'assets/images/hamburgerMenuIcon.png';
import navigationIcon from 'assets/images/navigation.png';
import routeStartIcon from 'assets/images/RouteStartIcon.png';
import routeEndIcon from 'assets/images/RouteEndIcon.png';
import downChevronIcon from 'assets/images/downChevron.png';
import upChevronIcon from 'assets/images/upChevron.png';
import {useNavigation} from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const MapComponent = ({route}) => {
  const renderPolyline = () => {
    return route.legs.map((leg, index) => {
      // 각 구간의 linestring 데이터를 Polyline으로 변환
      const coordinates = leg.passShape?.linestring.split(' ').map(coord => {
        const [lon, lat] = coord.split(',').map(parseFloat);
        return {latitude: lat, longitude: lon};
      });

      return (
        <Polyline
          key={index}
          coordinates={coordinates}
          strokeColor={`#${leg.routeColor || '000'}`} // 경로 색상, 없으면 검정색
          strokeWidth={8}
        />
      );
    });
  };

  const renderMarkers = () => {
    const markers = [];

    // 출발지 Marker
    markers.push(
      <Marker
        key="start"
        coordinate={{
          latitude: route.legs[0].start.lat,
          longitude: route.legs[0].start.lon,
        }}
        title="출발지"
        pinColor="green">
        <View bg={'red.500'} h={'20'} />
      </Marker>,
    );

    // 도착지 Marker
    markers.push(
      <Marker
        key="end"
        coordinate={{
          latitude: route.legs[route.legs.length - 1].end.lat,
          longitude: route.legs[route.legs.length - 1].end.lon,
        }}
        title="도착지"
        pinColor="red"
      />,
    );

    // 중간 경유지 Marker (버스 정류장, 지하철 역 등)
    route.legs.forEach((leg, legIndex) => {
      if (leg.passStopList) {
        leg.passStopList.stationList.forEach((station, stationIndex) => {
          markers.push(
            <Circle
              key={`station-${legIndex}-${stationIndex}`}
              // coordinate={{
              //   latitude: parseFloat(station.lat),
              //   longitude: parseFloat(station.lon),
              // }}
              title={station.stationName}
            />,
          );
        });
      }
    });

    return markers;
  };

  return (
    <MapView
      style={{width, height: 300}} // 지도의 높이 설정
      initialRegion={{
        latitude: route.legs[0].start.lat, // 경로의 첫 시작점을 지도의 초기 위치로 설정
        longitude: route.legs[0].start.lon,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}>
      {renderPolyline()}
      {renderMarkers()}
    </MapView>
  );
};

const HeaderComponent = ({onBackPress, title}) => (
  <HStack
    px={4}
    h={'56px'}
    alignItems="center"
    justifyContent="space-between"
    bg="white"
    borderBottomWidth={1}
    borderBottomColor="gray.200">
    <Button
      variant="ghost"
      onPress={onBackPress}
      _pressed={{backgroundColor: 'transparent'}}>
      <Image source={LeftChevron} alt="back" width={'24px'} height={'24px'} />
    </Button>
    <Text fontSize="18" bold isTruncated maxWidth="80%">
      {title}
    </Text>
    <Button
      variant="ghost"
      onPress={() => console.log('Close pressed')}
      _pressed={{backgroundColor: 'transparent'}}>
      <Image source={CloseIcon} alt="close" width={'24px'} height={'24px'} />
    </Button>
  </HStack>
);

const RouteInfoComponent = ({route}) => {
  const formatTime = date => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  const now = new Date(); // 현재 시간
  const departureTime = formatTime(now); // 출발 시간 포맷
  const arrivalTime = formatTime(
    new Date(now.getTime() + route.totalTime * 1000),
  ); // 도착 시간 포맷 (totalTime을 초 단위로 계산 후 더함)

  return (
    <VStack px={'18px'} bg="white" flex={1} w={'100%'} pb={'16px'}>
      <HStack justifyContent="space-between" alignItems="center">
        <HStack justifyContent={'flex-end'} alignItems={'baseline'}>
          <Text fontSize="32px" fontWeight="bold">
            {Math.ceil(route.totalTime / 60)}
          </Text>
          <Text fontSize="16px" fontWeight="medium">
            분
          </Text>
        </HStack>
        <View px={'6px'} py={'4px'} borderRadius={'4px'} bg={'#F0F0F3'}>
          <Text fontSize="12px" color="#8B8D98" fontWeight={'bold'}>
            {(route.totalDistance / 1000).toFixed(1)}km
          </Text>
        </View>
      </HStack>
      <HStack space={2}>
        <Text color="#60646C" fontSize="16px" fontWeight={'medium'}>
          {departureTime} - {arrivalTime}
        </Text>
        <View h={'100%'} bg={'#E8E8EC'} w={'0.5px'} />
        <Text color="#60646C" fontSize="16px" fontWeight={'medium'}>
          {route.fare.regular.totalFare.toLocaleString()}원
        </Text>
      </HStack>
      {/* 구간 정보를 순회하며 렌더링 */}
      <HStack
        alignItems="center"
        p={0}
        m={0}
        mt={'18px'}
        w={'100%'}
        justifyContent={'space-between'} // space-between으로 조정
      >
        {route.legs.map((leg, index) => {
          const legColor = `#${leg.routeColor || '888'}`; // 경로 색상, 없으면 기본 검정색
          const legTime = Math.ceil(leg.sectionTime / 60); // 구간 시간 (분 단위)

          return (
            <HStack
              key={index}
              flex={legTime}
              minW={'30px'}
              mx={'-1px'}
              alignItems="center">
              {/* flex={1}로 모든 요소가 동일한 비율로 확장되도록 */}
              {leg.mode === 'WALK' && (
                <HStack alignItems="center">
                  {/* flex 및 space 적용 */}
                  <View
                    p={'4px'}
                    bg={'#888'} // 도보 아이콘 색상 (예시)
                    borderRadius={'full'}
                    alignItems={'center'}
                    justifyContent="center"
                    w={'28px'} // 아이콘 크기 조정
                    h={'28px'}
                    zIndex={1}>
                    <Image
                      source={wheelchairIcon}
                      alt="wheelchair"
                      size="12px"
                    />
                  </View>
                  <Text
                    bg={'#F0F0F3'}
                    borderRadius={'full'}
                    py={'0px'}
                    fontSize="10px"
                    color={'#60646C'}
                    flex={legTime}
                    minW={'30px'}
                    mx={'-5px'}
                    textAlign="center" // 가운데 정렬
                  >
                    {legTime}분
                  </Text>
                </HStack>
              )}
              {leg.mode === 'BUS' && (
                <HStack alignItems="center">
                  {/* flex 및 space 적용 */}
                  <View
                    bg={legColor}
                    borderRadius={'full'}
                    alignItems={'center'}
                    justifyContent="center"
                    w={'28px'} // 아이콘 크기 조정
                    h={'28px'}
                    zIndex={1}>
                    <Image source={whiteBusIcon} alt="bus" size="12px" />
                  </View>
                  <Text
                    bg={legColor}
                    borderRadius={'full'}
                    py={'0px'}
                    fontSize="10px"
                    color={'white'}
                    flex={legTime}
                    minW={'30px'}
                    mx={'-5px'}
                    textAlign="center" // 가운데 정렬
                  >
                    {legTime}분
                  </Text>
                </HStack>
              )}
              {(leg.mode === 'SUBWAY' || leg.mode === 'TRAIN') && (
                <HStack alignItems="center">
                  {/* flex 및 space 적용 */}
                  <View
                    bg={legColor}
                    borderRadius={'full'}
                    alignItems={'center'}
                    justifyContent="center"
                    w={'28px'} // 아이콘 크기 조정
                    h={'28px'}
                    zIndex={1}>
                    <Image source={whiteBusIcon} alt="bus" size="12px" />
                  </View>
                  <Text
                    bg={legColor}
                    borderRadius={'4px'}
                    py={'0px'}
                    mx={'-5px'}
                    fontSize="10px"
                    color={'white'}
                    flex={legTime}
                    minW={'30px'}
                    mx={'-5px'}
                    textAlign="center" // 가운데 정렬
                  >
                    {legTime}분
                  </Text>
                </HStack>
              )}
            </HStack>
          );
        })}
      </HStack>
    </VStack>
  );
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

const renderBusTag = route => {
  if (!route) return null; // route가 undefined 또는 null인 경우 처리

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

const RouteDetailsComponent = ({route}) => {
  // 각 구간의 Collapse 상태를 관리하는 상태값
  const [expandedLegIndex, setExpandedLegIndex] = useState(null);

  const toggleCollapse = index => {
    setExpandedLegIndex(expandedLegIndex === index ? null : index);
  };

  const getLegStatus = (index, mode) => {
    if (index === 0) return '출발';
    if (mode === 'BUS' || mode === 'SUBWAY') return '승차';
    if (index === route.legs.length - 1) return '도착';
    return '환승';
  };

  return (
    <VStack
      space={4}
      p={'16px'}
      height={height / 2}
      mb={'240px'}
      borderTopColor={'#E0E1E6'}
      borderTopWidth={1}>
      {route.legs.map((leg, index) => {
        const legColor = `#${leg.routeColor || '888'}`; // 경로 색상, 없으면 기본 검정색
        const stationCount = leg.passStopList?.stationList.length - 1; // 정거장 또는 역의 수

        return (
          <VStack key={index} space={2} position={'relative'}>
            {/* 왼쪽에 있는 막대 */}
            <View
              alignItems="center"
              position={'absolute'}
              flex={1}
              width={'2px'}
              height={'100%'}
              bg={index !== leg.length - 2 ? legColor : 'transparent'}
              top={'60px'}
              bottom={0}
              left={'30px'}
            />
            <HStack
              alignItems="center"
              space={2}
              px={0}
              justifyContent={'flex-start'}>
              {/* 경로 아이콘 */}
              {index === 0 && (
                <View
                  w={'64px'}
                  alignItems={'center'}
                  borderColor={'white'}
                  borderWidth={8}>
                  <Image
                    source={routeStartIcon}
                    alt="start"
                    w={'36px'}
                    h={'40px'}
                  />
                </View>
              )}
              {leg.mode === 'BUS' && (
                <View
                  w={'64px'}
                  alignItems={'center'}
                  borderColor={'white'}
                  borderWidth={8}>
                  <View
                    w={'24px'}
                    h={'24px'}
                    justifyContent={'center'}
                    borderRadius={'full'}
                    alignItems={'center'}
                    bg={legColor}>
                    <Image source={whiteBusIcon} alt="bus" size="12px" />
                  </View>
                </View>
              )}
              {leg.mode === 'SUBWAY' && (
                <View
                  w={'64px'}
                  alignItems={'center'}
                  borderColor={'white'}
                  borderWidth={8}>
                  <View
                    w={'24px'}
                    h={'24px'}
                    justifyContent={'center'}
                    borderRadius={'full'}
                    mx={'20px'}
                    alignItems={'center'}
                    bg={legColor}>
                    <Image source={whiteBusIcon} alt="subway" size="12px" />
                  </View>
                </View>
              )}
              {index === route.legs.length - 1 && (
                <View
                  w={'64px'}
                  alignItems={'center'}
                  borderColor={'white'}
                  borderWidth={8}>
                  <Image
                    source={routeEndIcon}
                    alt="end"
                    w={'36px'}
                    h={'40px'}
                  />
                </View>
              )}
              {index !== 0 &&
                index !== route.legs.length - 1 &&
                leg.mode !== 'BUS' &&
                leg.mode !== 'SUBWAY' && (
                  <View
                    w={'64px'}
                    alignItems={'center'}
                    borderColor={'white'}
                    borderWidth={8}>
                    <View
                      w={'24px'}
                      h={'24px'}
                      justifyContent={'center'}
                      borderRadius={'full'}
                      mx={'20px'}
                      alignItems={'center'}
                      bg={legColor}>
                      <Image
                        source={wheelchairIcon}
                        alt="transfer"
                        size="12px"
                      />
                    </View>
                  </View>
                )}

              {/* 경로 정보 */}
              <VStack flex={1} space={1}>
                <Text fontWeight="bold" color="black" fontSize={'16px'}>
                  {leg.start.name} {getLegStatus(index, leg.mode)}
                </Text>
                <HStack alignItems={'center'} space={1}>
                  {leg.mode === 'WALK' && (
                    <Text
                      fontSize="14px"
                      color="gray.500"
                      fontWeight={'medium'}>
                      휠체어 {leg.distance}m
                    </Text>
                  )}
                  {renderBusTag(leg.route)}
                  {leg.mode === 'BUS' && (
                    <Text fontSize="16px" color="black" fontWeight={'semibold'}>
                      {leg.route.includes(':')
                        ? leg.route.split(':')[1]
                        : leg.route}
                    </Text>
                  )}
                  {leg.mode === 'SUBWAY' && (
                    <Text fontSize="16px" color="black" fontWeight={'semibold'}>
                      {leg.route}
                    </Text>
                  )}
                  {leg.arrtime && (
                    <CountdownTimer initialSeconds={leg.arrtime} />
                  )}
                </HStack>
                <HStack alignItems={'center'}>
                  {leg.mode === 'BUS' && (
                    <Text
                      fontSize="14px"
                      color="gray.500"
                      mr={2}
                      fontWeight={'medium'}>
                      {stationCount}개 정류장 이동
                    </Text>
                  )}
                  {leg.mode === 'SUBWAY' && (
                    <Text
                      fontSize="14px"
                      color="gray.500"
                      mr={2}
                      fontWeight={'medium'}>
                      {stationCount}개 역 이동
                    </Text>
                  )}
                  <Text fontSize="16px" color="black" fontWeight={'bold'}>
                    {Math.ceil(leg.sectionTime / 60)}분
                  </Text>

                  {/* Collapse/Expand 아이콘 */}
                  {leg.mode !== 'WALK' && (
                    <IconButton
                      icon={
                        expandedLegIndex === index ? (
                          <Image
                            source={upChevronIcon}
                            alt="up"
                            w={'20px'}
                            h={'20px'}
                          />
                        ) : (
                          <Image
                            source={downChevronIcon}
                            alt="down"
                            w={'20px'}
                            h={'20px'}
                          />
                        )
                      }
                      size={'24px'}
                      _pressed={{opacity: 0.5}}
                      onPress={() => toggleCollapse(index)}
                    />
                  )}
                </HStack>
              </VStack>
            </HStack>
            {/* Collapse 영역: 정거장 정보 표시 */}
            {leg.mode !== 'WALK' && (
              <Collapse isOpen={expandedLegIndex === index}>
                <VStack space={1} mt={0} position={'relative'}>
                  <View
                    position={'absolute'}
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg={legColor}
                    opacity={0.1}
                    borderRadius={'12px'}
                  />
                  {leg.passStopList.stationList.map((station, i) => (
                    <HStack
                      key={i}
                      justifyContent="space-between"
                      alignItems={'center'}
                      py={1}>
                      <HStack>
                        <View w={'76px'} />
                        <Text fontSize="14px" color="gray.500">
                          {station.stationName}
                        </Text>
                      </HStack>
                    </HStack>
                  ))}
                </VStack>
              </Collapse>
            )}
          </VStack>
        );
      })}
    </VStack>
  );
};

const ActionButtonsComponent = ({onDetailsPress, modalState}) => {
  const [voiceNavigationState, setVoiceNavigationState] =
    useRecoilState(VoiceNavigationState);

  return (
    <HStack
      zIndex={10}
      justifyContent="space-between"
      p={4}
      bg="white"
      position={'absolute'}
      height={'80px'}
      w={'100%'}
      bottom={0}>
      <Button
        bg={'#F0F0F3'}
        borderRadius={'10px'}
        flex={1}
        mr={2}
        _pressed={{bg: 'gray.200'}}
        leftIcon={
          <>
            {modalState === '접기' ? (
              <Image
                source={hamburgerMenuIcon}
                alt="details"
                style={{width: 20, height: 20}}
              />
            ) : (
              <Image
                source={navigationIcon}
                alt="navigation"
                style={{width: 20, height: 20}}
              />
            )}
          </>
        }
        onPress={onDetailsPress}>
        <Text color={'#60646C'} fontSize={'16px'} fontWeight={'semibold'}>
          {modalState === '접기' ? '상세 경로' : '지도뷰 보기'}
        </Text>
      </Button>
      <Button
        flex={2}
        borderRadius={'10px'}
        bg={voiceNavigationState ? '#FF3B30' : '#0090FF'}
        onPress={() => {
          setVoiceNavigationState(!voiceNavigationState);
        }}
        _text={{color: 'white'}}
        _pressed={{bg: '#0077CC'}}
        leftIcon={
          voiceNavigationState ? undefined : (
            <Image
              source={navigationIcon}
              alt="navigation"
              style={{width: 20, height: 20}}
            />
          )
        }>
        <Text color={'white'} fontSize={'16px'} fontWeight={'bold'}>
          {voiceNavigationState ? '음성 안내 종료' : '음성 안내 시작하기'}
        </Text>
      </Button>
    </HStack>
  );
};

const RouteTransportPage = () => {
  const selectedRoute = useRecoilValue(selectedRouteState); // 선택된 경로 가져오기
  const translateY = useSharedValue(height / 2 + 240); // 애니메이션을 위한 위치 값
  const [modalState, setModalState] = useState('접기');
  const navigation = useNavigation();
  // PanResponder를 사용하여 위/아래 스와이프 감지
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // 세로로 20 이상 움직일 경우 감지, 단 스크롤 중일 때는 감지하지 않음
        return Math.abs(gestureState.dy) > 20 && !gestureState.vy;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 20) {
          // 아래로 스와이프
          translateY.value = withSpring(height / 2 + 240); // 닫힘 애니메이션
          setModalState('접기');
        } else if (gestureState.dy < -20) {
          // 위로 스와이프
          translateY.value = withSpring(160); // 열림 애니메이션
          setModalState('펼치기');
        }
      },
    }),
  ).current;

  // 애니메이션 스타일
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: translateY.value}],
  }));

  return (
    <VStack flex={1} bg="white" position={'relative'}>
      <HeaderComponent
        onBackPress={() => navigation.goBack()}
        title={selectedRoute.legs[selectedRoute.legs.length - 1].start.name}
      />
      <MapComponent route={selectedRoute} />
      {/* <Animated.View style={{flex: 1, backgroundColor: 'red'}} /> */}

      <Animated.View
        style={[
          {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            backgroundColor: 'white',
            borderRadius: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: -8,
            },
            shadowRadius: 20,
            shadowOpacity: 0.1,
          },
          animatedStyle,
        ]}
        {...panResponder.panHandlers}>
        <View
          w={'32px'}
          h={'4px'}
          bg={'#EEF0F3'}
          my={'18px'}
          borderRadius={'full'}
        />
        <VStack w="100%" borderTopRadius="20px">
          <RouteInfoComponent route={selectedRoute} />
          <ScrollView w={'100%'} pb={'80px'} nestedScrollEnabled={true}>
            <RouteDetailsComponent route={selectedRoute} />
          </ScrollView>
        </VStack>
      </Animated.View>
      <ActionButtonsComponent
        modalState={modalState}
        onDetailsPress={() => {
          if (modalState === '접기') {
            translateY.value = withSpring(160);
            setModalState('펼치기');
          } else {
            translateY.value = withSpring(height / 2 + 240);
            setModalState('접기');
          }
        }}
      />
    </VStack>
  );
};

export default RouteTransportPage;
