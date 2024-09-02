import React, {useState, useRef, useEffect} from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Image,
  IconButton,
} from 'native-base';
import {Animated} from 'react-native';
import targetIcon from '../../assets/images/target2.png';
import navigationBlue from '../../assets/images/navigationBlue.png';
import mediumVolume from '../../assets/images/medium-volume.png';
import mute from '../../assets/images/mute.png';
import route from '../../assets/images/route.png';

// PNG 이미지 파일을 import로 불러옵니다.
import arrowUpImage from '../../assets/images/arrowUp.png';
import arrowDownImage from '../../assets/images/arrowDown.png';
import {useRecoilState, useRecoilValue} from 'recoil';
import {VoiceGuideAtom, walkingRouteAtom} from 'state/activeWalkingRouteAtom';
import {useNavigation} from '@react-navigation/native';
import {useCalculateArrivalTime} from 'hooks/searchRoute/useCalculatorArrivalTime';
import {DestinationState, StartPointState} from 'state/RouteAtoms';
import {
  endRouteGuidance,
  expectedArrivalTimeGuidance,
  narrowViewButtonGuidance,
  wideViewButtonGuidance,
} from 'utils/hapticAndTTS';

export default function ActiveWalkingRouteBottomSheetComponent({
  setMapToCurrentLocation,
  setMapToSpecificLocation,
}) {
  const navigation = useNavigation();

  const BottomSheetHeight = 87;
  const [expanded, setExpanded] = useState<boolean>(false);
  // const [isWideViewState, setIsWideViewState] = useState<boolean>(false);
  const animatedHeight = useRef(new Animated.Value(BottomSheetHeight)).current;
  const [voiceGuideState, setVoiceGuideState] = useRecoilState(VoiceGuideAtom);
  const startPointState = useRecoilValue(StartPointState);
  const destinationState = useRecoilValue(DestinationState);

  const walkingRouteState = useRecoilValue(walkingRouteAtom);
  const totalTime: number =
    walkingRouteState.features[0].properties.totalTime || 0;
  const totalDistance: number =
    walkingRouteState.features[0].properties.totalDistance || 0;

  const {arrivalTime, minutes} = useCalculateArrivalTime(totalTime);

  const terminateRouteGuide = async () => {
    // 음성 안내 state를 false로 변경
    setVoiceGuideState(false);

    // 경로 탐색 페이지로 이동
    navigation.navigate('Route');
  };

  const toggleHeight = () => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? BottomSheetHeight : BottomSheetHeight + 60, // 접혔을 때와 펴졌을 때의 높이 설정
      duration: 150, // 애니메이션 지속 시간 (밀리초)
      useNativeDriver: false, // 레이아웃 애니메이션에 useNativeDriver는 false여야 함
    }).start();
    setExpanded(!expanded);
  };

  //출발지와 도착지 사이의 위도 경도를 계산하여 지도의 중심을 찾고 중심부터 출발지거리에 비례하여 적절한 zoom 배율을 설정하는 함수
  const adjustAngleToMid = () => {
    const startPoint = startPointState;
    console.log('🚀 ~ adjustAngleToMid ~ startPoint:', startPoint);
    const destination = destinationState;
    console.log('🚀 ~ adjustAngleToMid ~ destination:', destination);

    // 확실히 숫자로 변환하여 덧셈 수행
    const startLatitude = Number(startPoint.latitude);
    const destinationLatitude = Number(destination.latitude);
    const startLongitude = Number(startPoint.longitude);
    const destinationLongitude = Number(destination.longitude);

    const latitude: number = (startLatitude + destinationLatitude) / 2;
    console.log(
      '🚀 ~ adjustAngleToMid ~ startPoint.latitude + destination.latitude:',
      startLatitude + destinationLatitude,
    );
    console.log('🚀 ~ adjustAngleToMid ~ latitude:', latitude);

    const longitude: number = (startLongitude + destinationLongitude) / 2;
    console.log('🚀 ~ adjustAngleToMid ~ longitude:', longitude);

    const distance = Math.sqrt(
      Math.pow(startLatitude - destinationLatitude, 2) +
        Math.pow(startLongitude - destinationLongitude, 2),
    );
    console.log('🚀 ~ adjustAngleToMid ~ distance:', distance);
    // TODO: 아래 비율 테스트 요함(광주 끝끝, 광주 근거리)
    // 수정된 줌 레벨 설정 로직
    let zoomLevel = 5;
    if (distance < 0.001) {
      zoomLevel = 8; // 매우 가까운 거리
    } else if (distance < 0.01) {
      zoomLevel = 6.5; // 가까운 거리
    } else if (distance < 0.1) {
      zoomLevel = 5.7; // 근거리
    } else if (distance < 0.5) {
      zoomLevel = 5.5; // 중간 거리
    } else if (distance < 1) {
      zoomLevel = 5; // 조금 멀리
    } else if (distance < 2) {
      zoomLevel = 4; // 더 먼 거리
    } else if (distance < 5) {
      zoomLevel = 4; // 먼 거리
    }
    setMapToSpecificLocation(zoomLevel, latitude, longitude);
  };

  useEffect(() => {
    expectedArrivalTimeGuidance(arrivalTime);
  }, []);

  return (
    <Box flex={1} position="relative">
      {/* 하단 박스 외부에 버튼을 절대 위치로 배치 */}
      <VStack
        position="absolute"
        left={2}
        bottom={BottomSheetHeight + 7}
        space={2}
        alignItems="center">
        <IconButton
          icon={
            <Image key="wideView" source={route} alt="Target Icon" size="2xs" />
          }
          borderRadius="full"
          bg="#FFFFFF"
          borderWidth={1}
          borderColor={'#D9D9E0'}
          padding={14}
          // _hover={{bg: 'blue.600'}}
          _pressed={{bg: '#D9D9E0'}}
          onPress={() => {
            adjustAngleToMid();
            wideViewButtonGuidance();
          }}
        />
        {/* <IconButton
          icon={
            voiceGuideState ? (
              <Image
                key="mediumVolume"
                source={mediumVolume}
                alt="Target Icon"
                size="2xs"
              />
            ) : (
              <Image key="mute" source={mute} alt="Target Icon" size="2xs" />
            )
          }
          borderRadius="full"
          borderWidth={1}
          borderColor={'#D9D9E0'}
          padding={14}
          bg="#FFFFFF"
          // _hover={{bg: 'green.600'}}
          _pressed={{bg: '#D9D9E0'}}
          onPress={() => {
            setVoiceGuideState(!voiceGuideState);
          }}
        /> */}
        <IconButton
          icon={<Image source={targetIcon} alt="Target Icon" size="2xs" />}
          borderRadius="full"
          bg="#113264"
          borderWidth={1}
          borderColor={'#D9D9E0'}
          padding={14}
          // _hover={{bg: 'red.600'}}
          _pressed={{bg: '#D9D9E0'}}
          onPress={() => {
            setMapToCurrentLocation(8);
            narrowViewButtonGuidance();
          }}
        />
      </VStack>

      <Animated.View
        style={{
          height: animatedHeight,
        }}>
        <Box
          flex={1}
          bg="white"
          shadow={2}
          p={4}
          borderTopLeftRadius={16}
          borderTopRightRadius={16}>
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Text fontSize="xs" color="gray.500">
                도착예정
              </Text>
              <HStack>
                {/* TODO: 오전 오후 반영 */}
                {/* <Text fontSize="xl" fontWeight="extrabold">
                  오후
                </Text> */}
                <Text fontSize="xl" fontWeight="extrabold">
                  {arrivalTime}
                </Text>
              </HStack>
            </VStack>
            <VStack>
              <Text fontSize="xs" color="gray.500">
                시간
              </Text>
              <HStack>
                <Text fontSize="xl" fontWeight="extrabold">
                  {parseInt(minutes)}
                </Text>
                <Text fontSize="xl" fontWeight="extrabold">
                  분
                </Text>
              </HStack>
            </VStack>
            <VStack>
              <Text fontSize="xs" color="gray.500">
                거리
              </Text>
              <HStack>
                <Text fontSize="xl" fontWeight="extrabold">
                  {parseInt(totalDistance / 100) / 10}
                </Text>
                <Text fontSize="xl" fontWeight="extrabold">
                  km
                </Text>
              </HStack>
            </VStack>
            {expanded ? (
              <Image
                source={arrowDownImage}
                alt="Toggle Arrow"
                size="xs"
                onTouchEnd={toggleHeight}
                borderRadius={999}
                padding={6}
                backgroundColor={'#F0F0F3'}
              />
            ) : (
              <Image
                source={arrowUpImage}
                alt="Toggle Arrow"
                size="xs"
                onTouchEnd={toggleHeight}
                borderRadius={999}
                padding={6}
                backgroundColor={'#F0F0F3'}
              />
            )}
          </HStack>

          {expanded && (
            <Button
              mt={4}
              borderRadius={10}
              colorScheme="red"
              onPress={() => {
                terminateRouteGuide();
                endRouteGuidance();
              }}>
              <Text color="white" fontWeight={'bold'}>
                길 안내 종료하기
              </Text>
            </Button>
          )}
        </Box>
      </Animated.View>
    </Box>
  );
}
