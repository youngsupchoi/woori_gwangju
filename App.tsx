import React from 'react';
import {RecoilRoot} from 'recoil';
import {StatusBar, useColorScheme} from 'react-native';
import AppNavigator from './src/navigation';
import {SafeAreaView, View} from 'react-native';
import {extendTheme, NativeBaseProvider} from 'native-base';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = extendTheme({
    fontConfig: {
      Pretendard: {
        100: {
          normal: 'Pretendard-Thin',
        },
        200: {
          normal: 'Pretendard-ExtraLight',
        },
        300: {
          normal: 'Pretendard-Light',
        },
        400: {
          normal: 'Pretendard-Regular',
        },
        500: {
          normal: 'Pretendard-Medium',
        },
        600: {
          normal: 'Pretendard-SemiBold',
        },
        700: {
          normal: 'Pretendard-Bold',
        },
        800: {
          normal: 'Pretendard-ExtraBold',
        },
        900: {
          normal: 'Pretendard-Black',
        },
      },
      SBAGGRO: {
        normal: 'SB-AGGRO',
      },
    },

    // Make sure values below matches any of the keys in `fontConfig`
    fonts: {
      heading: 'Pretendard',
      body: 'Pretendard',
      mono: 'Pretendard',
    },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <RecoilRoot>
        <SafeAreaView style={{flex: 1}}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <View style={{flex: 1}}>
            <AppNavigator />
          </View>
        </SafeAreaView>
      </RecoilRoot>
    </NativeBaseProvider>
  );
}

export default App;
