import React, {useState} from 'react';
import {Box, Text, HStack, Button, Image, View} from 'native-base';
import navigationIcon from '../../assets/images/navigation.png';
import {useRecoilState} from 'recoil';
import {VoiceGuideAtom, walkingRouteAtom} from 'state/activeWalkingRouteAtom';
import {useNavigation} from '@react-navigation/native';
import Tts from 'react-native-tts';

export default function WalkingRouteBottmeSheetComponent() {
  const navigation = useNavigation();

  const BottomSheetHeight = 110;
  const [isWideViewState, setIsWideViewState] = useState<boolean>(false);
  const [voiceGuideState, setVoiceGuideState] = useRecoilState(VoiceGuideAtom);

  const [walkingRouteState, setWalkingRouteState] =
    useRecoilState(walkingRouteAtom);
  return (
    <Box flex={1} position="relative">
      <Box
        height={BottomSheetHeight + 80}
        bg="white"
        shadow={2}
        p={4}
        borderTopLeftRadius={16}
        borderTopRightRadius={16}>
        <HStack
          justifyContent="space-between"
          alignItems="center"
          paddingBottom={'8px'}>
          <HStack alignItems="baseline">
            {parseInt(walkingRouteState.features[0].properties.totalTime / 60) >
            60 ? (
              <HStack alignItems="baseline">
                <Text fontSize="3xl" fontWeight="extrabold">
                  {parseInt(
                    walkingRouteState.features[0].properties.totalTime / 60,
                  ) % 60}
                </Text>
                <Text fontSize="sm" fontWeight="normal">
                  {`시간 `}
                </Text>
              </HStack>
            ) : null}
            <Text fontSize="3xl" fontWeight="extrabold">
              {parseInt(
                walkingRouteState.features[0].properties.totalTime / 60,
              ) % 60}
            </Text>
            <Text fontSize="sm" fontWeight="normal">
              분
            </Text>
          </HStack>

          <HStack
            alignItems="baseline"
            borderRadius="md"
            backgroundColor={'#F0F0F3'}
            paddingX={2}>
            <Text fontSize="xl" fontWeight="bold" color="gray.500">
              {parseInt(
                walkingRouteState.features[0].properties.totalDistance / 100,
              ) / 10}
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="gray.500">
              km
            </Text>
          </HStack>
        </HStack>
        <Box borderTopWidth={1} borderTopColor={'#E0E0E0'} paddingTop={'10px'}>
          <Text fontSize="xs" color="gray.500">
            휠체어 이동 시간을 고려한 도착 예정 시간입니다
          </Text>

          <HStack justifyContent="start" alignItems="center">
            <Text fontSize="xs" color="gray.500">
              안내정보는 참고로만 활용하세요
            </Text>
            <Text
              underline
              fontSize="xs"
              color="gray.500"
              onPress={() => {
                navigation.navigate('LimitationsAndResponsibilitiesPage');
              }}>
              (정보 제공의 한계 및 책임)
            </Text>
          </HStack>
        </Box>

        <Button
          mt={4}
          flexDirection={'row'}
          borderRadius={10}
          backgroundColor={'#0090FF'}
          onPress={() => {
            Tts.speak('경로 안내를 시작합니다'); // 음성 안내 추가
            // 음성 안내 시작
            setVoiceGuideState(true);

            navigation.navigate('ActiveWalkingRoutePage');
          }}>
          <HStack>
            {/* <Image
              source={navigationIcon}
              alt="Route"
              size="6px"
              borderRadius={999}
              padding={6}
              backgroundColor={'#0090FF'}
            /> */}
            <Text color="white" fontWeight={'bold'}>
              길 안내 시작하기
            </Text>
          </HStack>
        </Button>
      </Box>
    </Box>
  );
}
