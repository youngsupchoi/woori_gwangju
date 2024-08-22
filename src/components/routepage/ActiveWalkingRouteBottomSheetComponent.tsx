import React, {useState, useRef} from 'react';
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

export default function ActiveWalkingRouteBottomSheetComponent({
  setMapToCurrentLocation,
}) {
  const navigation = useNavigation();

  const BottomSheetHeight = 87;
  const [expanded, setExpanded] = useState<boolean>(false);
  const [isWideViewState, setIsWideViewState] = useState<boolean>(false);
  const animatedHeight = useRef(new Animated.Value(BottomSheetHeight)).current;
  const [voiceGuideState, setVoiceGuideState] = useRecoilState(VoiceGuideAtom);

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
            isWideViewState ? (
              <Image
                key="wideView"
                source={route}
                alt="Target Icon"
                size="2xs"
              />
            ) : (
              <Image
                key="narrowViwe"
                source={navigationBlue}
                alt="Target Icon"
                size="2xs"
              />
            )
          }
          borderRadius="full"
          bg="#FFFFFF"
          borderWidth={1}
          borderColor={'#D9D9E0'}
          padding={14}
          // _hover={{bg: 'blue.600'}}
          _pressed={{bg: '#D9D9E0'}}
          onPress={() => setIsWideViewState(!isWideViewState)}
        />
        <IconButton
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
        />
        <IconButton
          icon={<Image source={targetIcon} alt="Target Icon" size="2xs" />}
          borderRadius="full"
          bg="#113264"
          borderWidth={1}
          borderColor={'#D9D9E0'}
          padding={14}
          // _hover={{bg: 'red.600'}}
          _pressed={{bg: '#D9D9E0'}}
          onPress={() => setMapToCurrentLocation(12)}
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
                <Text fontSize="xl" fontWeight="extrabold">
                  오후
                </Text>

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
