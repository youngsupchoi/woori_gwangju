import React, {useEffect, useRef} from 'react';
import {Image, View} from 'native-base';
import SplashImage from 'assets/images/SplashImage.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {Animated} from 'react-native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(1)).current; // 애니메이션 값 초기화 (1 = 불투명)

  useEffect(() => {
    const checkDisabilityType = async () => {
      try {
        const disabilityType = await AsyncStorage.getItem('disabilityType');

        // 2초 후에 값이 있는지 확인하고 페이지를 이동
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0, // 투명도 0으로
            duration: 500, // 1초 동안 애니메이션
            useNativeDriver: true, // 네이티브 드라이버 사용
          }).start(() => {
            if (disabilityType) {
              navigation.replace('Main'); // 'disabilityType' 값이 있으면 Main으로 이동
            } else {
              navigation.replace('Onboarding'); // 값이 없으면 Onboarding으로 이동
            }
          });
        }, 2000); // 2초 딜레이
      } catch (error) {
        console.error('Error reading disabilityType from AsyncStorage:', error);
        navigation.replace('Onboarding'); // 에러 발생 시 온보딩으로 이동
      }
    };

    checkDisabilityType();
  }, [fadeAnim, navigation]);

  return (
    <Animated.View
      style={{
        flex: 1,
        backgroundColor: '#18A8F1',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: fadeAnim, // 애니메이션에 사용될 투명도 값 적용
      }}>
      <Image source={SplashImage} alt="logo" size="100%" resizeMode="contain" />
    </Animated.View>
  );
};

export default SplashScreen;
