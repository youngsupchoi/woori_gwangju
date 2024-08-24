import React from 'react';
import {
  createStackNavigator,
  StackCardInterpolationProps,
} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {VStack, Text, Pressable, HStack, Image} from 'native-base';
import OnboardingPage from '../screens/OnboardingPage';
import MainPage from '../screens/MainPage';
import SearchPage from '../screens/SearchPage';
import SearchResultPage from '../screens/SearchResultPage';
import SearchDetailTransportPage from '../screens/SearchDetailTransportPage';
import SearchDetailModificationPage from '../screens/SearchDetailModificationPage';
import RouteTransportPage from '../screens/RouteTransportPage';
import useCurrentLocation from 'hooks/currentLocation/useCurrentLocation';
import VoiceSearchPage from 'screens/VoiceSearchPage';
import RoutePage from 'screens/RoutePage';
import ActiveWalkingRoutePage from 'screens/ActiveWalkingRoutePage';
import PrivacyPage from 'screens/PrivacyPage';
import TermPage from 'screens/TermPage';
import disabledIcon from 'assets/images/onboardingWheelchair.png';
import rightChevron from 'assets/images/rightChevron.png';

import LimitationsAndResponsibilitiesPage from 'screens/LimitationsAndResponsibilitiesPage';
import {useLocationTracking} from 'hooks/currentLocation/useLocationTracking';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// 커스텀 DrawerContent
const CustomDrawerContent = ({navigation}) => {
  return (
    <VStack flex={1} bg="white" p={4} safeArea>
      <Pressable onPress={() => navigation.navigate('Onboarding')}>
        <HStack alignItems="center" justifyContent="space-between" py={4}>
          <HStack alignItems={'center'} space={'2px'}>
            <Image source={disabledIcon} alt="disabled" size={'28px'} />
            <Text fontSize="20px" fontWeight="semibold">
              휠체어 이용자 모드
            </Text>
          </HStack>
          <Image source={rightChevron} alt="right" size={'24px'} />
        </HStack>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Privacy')}>
        <Text fontSize="20px" fontWeight={'medium'} py={2}>
          개인정보처리방침
        </Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Term')}>
        <Text fontSize="20px" fontWeight={'medium'} py={2}>
          서비스이용약관
        </Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Onboarding')}>
        <Text fontSize="20px" fontWeight={'medium'} py={2}>
          설정
        </Text>
      </Pressable>
    </VStack>
  );
};

// StackNavigator를 정의하는 함수
const MainStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="Main"
    screenOptions={{
      headerShown: false,
      cardStyleInterpolator: ({current}: StackCardInterpolationProps) => ({
        cardStyle: {
          opacity: current.progress,
        },
      }),
    }}>
    <Stack.Screen name="Main" component={MainPage} />
    <Stack.Screen name="Search" component={SearchPage} />
    <Stack.Screen name="SearchResult" component={SearchResultPage} />
    <Stack.Screen
      name="SearchDetailTransport"
      component={SearchDetailTransportPage}
    />
    <Stack.Screen name="VoiceSearch" component={VoiceSearchPage} />
    <Stack.Screen
      name="SearchDetailModification"
      component={SearchDetailModificationPage}
    />
    <Stack.Screen name="Route" component={RoutePage} />
    <Stack.Screen name="RouteTransport" component={RouteTransportPage} />
    {/* <Stack.Screen name="RouteWheelchair" component={RouteWheelchairPage} /> */}
    <Stack.Screen
      name="ActiveWalkingRoutePage"
      component={ActiveWalkingRoutePage}
    />
    <Stack.Screen
      name="LimitationsAndResponsibilitiesPage"
      component={LimitationsAndResponsibilitiesPage}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  useCurrentLocation();
  useLocationTracking(3000); // 3초마다 위치를 트래킹합니다.

  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={props => <CustomDrawerContent {...props} />}
        screenOptions={{headerShown: false}}
        initialRouteName="MainStack">
        <Drawer.Screen name="MainStack" component={MainStackNavigator} />
        <Drawer.Screen name="Onboarding" component={OnboardingPage} />
        <Drawer.Screen name="Privacy" component={PrivacyPage} />
        <Drawer.Screen name="Term" component={TermPage} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
