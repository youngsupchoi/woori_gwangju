import React from 'react';
import {Center, Image, Button, Text, VStack, View} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image'; // FastImage 사용
import disabledPeople from 'assets/gif/disabled_people.gif';
import onboardingWheelchair from 'assets/images/onboardingWheelchair.png';
import onboardingBlindMan from 'assets/images/onboardingBlindMan.png';
import onboardingDeaf from 'assets/images/onboardingDeaf.png';

const OnboardingPage = () => {
  const navigation = useNavigation();

  const handleDisabilitySelection = async type => {
    try {
      await AsyncStorage.removeItem('disabilityType');
      await AsyncStorage.setItem('disabilityType', type);
      navigation.navigate('Main');
    } catch (error) {
      console.error('Error saving disability type to AsyncStorage', error);
    }
  };

  const renderDisabilityButton = (label, type, icon) => (
    <Button
      variant="outline"
      w={'100%'}
      p={'20px'}
      borderColor="#E0E1E6"
      alignItems={'flex-start'}
      textAlign={'left'}
      justifyContent={'flex-start'}
      _pressed={{bg: 'gray.200'}}
      borderRadius={'20px'}
      leftIcon={<Image source={icon} size={'36px'} alt="icon" />}
      onPress={() => handleDisabilitySelection(type)}>
      <Text
        fontFamily={'mono'}
        fontSize={'20px'}
        color={'#11181C'}
        fontWeight={'semibold'}
        textAlign={'left'}>
        {label}
      </Text>
    </Button>
  );

  return (
    <Center flex={1} bg="white" alignItems={'center'} justifyContent={'center'}>
      {/* 제목 */}
      <VStack
        space={2}
        pt={10}
        alignItems="flex-start"
        alignContent={'center'}
        w={'100%'}
        px={'18px'}>
        <Text
          fontFamily={'mono'}
          fontSize="28px"
          fontWeight="bold"
          textAlign="left">
          어떤 도움이 필요하신가요?
        </Text>
        <Text
          fontFamily={'mono'}
          fontSize={'16px'}
          color="coolGray.500"
          textAlign="left">
          맞춤형 도움을 제공해드릴게요.
        </Text>
      </VStack>

      {/* 이미지 */}
      <View w={'100%'}>
        <FastImage
          source={disabledPeople}
          style={{width: '100%', height: 200}} // 스타일로 크기 설정
          resizeMode={FastImage.resizeMode.contain} // 크기에 맞게 조정
        />
      </View>

      {/* 버튼들 */}
      <VStack space={4} w="100%" px={'18px'} pb={8} alignItems={'center'}>
        {renderDisabilityButton(
          '휠체어로 이동해야 해요.',
          '지체장애',
          onboardingWheelchair,
        )}
        {renderDisabilityButton(
          '시각 장애가 있어요.',
          '시각장애',
          onboardingBlindMan,
        )}
        {renderDisabilityButton(
          '청각 장애가 있어요.',
          '청각장애',
          onboardingDeaf,
        )}
      </VStack>
    </Center>
  );
};

export default OnboardingPage;
