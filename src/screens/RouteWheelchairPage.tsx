import React, {useState, useRef} from 'react';
import {Box, Text, VStack, HStack, Button, Image} from 'native-base';
import {Animated} from 'react-native';

// PNG 이미지 파일을 import로 불러옵니다.
import arrowUpImage from '../assets/images/arrowUp.png';
import arrowDownImage from '../assets/images/arrowDown.png';

export default function ActiveRouteInfoBottomSheet() {
  const [expanded, setExpanded] = useState<boolean>(false);
  const animatedHeight = useRef(new Animated.Value(112)).current;

  const toggleHeight = () => {
    Animated.timing(animatedHeight, {
      toValue: expanded ? 112 : 190, // 접혔을 때와 펴졌을 때의 높이 설정
      duration: 300, // 애니메이션 지속 시간 (밀리초)
      useNativeDriver: false, // 레이아웃 애니메이션에 useNativeDriver는 false여야 함
    }).start();
    setExpanded(!expanded);
  };

  return (
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
            <Text fontSize="lg" fontWeight="bold">
              오후 1:51
            </Text>
          </VStack>
          <VStack>
            <Text fontSize="xs" color="gray.500">
              시간
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              23분
            </Text>
          </VStack>
          <VStack>
            <Text fontSize="xs" color="gray.500">
              거리
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              1.9 km
            </Text>
          </VStack>
          <Image
            source={expanded ? arrowDownImage : arrowDownImage}
            alt="Toggle Arrow"
            size="sm"
            onTouchEnd={toggleHeight}
          />
        </HStack>

        {expanded && (
          <Button mt={4} colorScheme="red">
            길 안내 종료하기
          </Button>
        )}
      </Box>
    </Animated.View>
  );
}
