import React from 'react';
import {Center, Image, Button, Text, VStack} from 'native-base';

const OnboardingPage = () => {
  return (
    <Center flex={1} px={6} bg="white">
      {/* 제목 */}
      <VStack
        space={2}
        alignItems="center"
        alignContent={'center'}
        justifyContent={'center'}
        flex={1}>
        <Text fontSize="2xl" fontWeight="bold" textAlign="center">
          어떤 도움이 필요하신가요?
        </Text>
        <Text color="coolGray.500" textAlign="center">
          맞춤형 도움을 제공해드릴게요.
        </Text>
      </VStack>

      {/* 이미지 */}
      <Image
        source={require('../assets/gif/disabled_people.gif')}
        alt="Disabled People"
        size="2xl"
        resizeMode="cover"
        mb={8}
        flex={1}
      />

      {/* 버튼들 */}
      <VStack
        space={4}
        flex={1}
        w="100%"
        pb={8}
        alignItems={'center'}
        justifyContent={'center'}>
        <Button
          variant="outline"
          borderRadius="lg"
          flex={1}
          w={'100%'}
          textAlign={'center'}
          justifyContent={'center'}
          alignItems={'center'}
          borderColor="coolGray.300"
          _text={{
            fontSize: 'lg',
          }}
          //   leftIcon={<Text fontSize="lg">🦽</Text>}
        >
          휠체어로 이동해야 해요.
        </Button>

        <Button
          variant="outline"
          borderRadius="lg"
          flex={1}
          w={'100%'}
          alignItems={'center'}
          borderColor="coolGray.300"
          _text={{
            fontSize: 'lg',
          }}
          //   leftIcon={<Text fontSize="lg">👨‍🦯</Text>}
        >
          시각 장애가 있어요.
        </Button>

        <Button
          variant="outline"
          borderRadius="lg"
          flex={1}
          w={'100%'}
          alignItems={'center'}
          borderColor="coolGray.300"
          _text={{
            fontSize: 'lg',
          }}
          //   leftIcon={<Text fontSize="lg">🦻</Text>}
        >
          청각 장애가 있어요.
        </Button>
      </VStack>

      {/* 아래 버튼 */}
      {/* <Button
        mt={4}
        bg="coolGray.100"
        borderRadius="full"
        _text={{
          fontSize: 'lg',
          textAlign: 'center',
          color: 'coolGray.700',
        }}
        w="100%">
        일단 먼저 둘러볼게요
      </Button> */}
    </Center>
  );
};

export default OnboardingPage;
