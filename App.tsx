import React from 'react';
import {RecoilRoot} from 'recoil';
import {StatusBar, useColorScheme} from 'react-native';
import AppNavigator from './src/navigation';
import {styled} from 'nativewind'; // NativeWind의 styled 함수 임포트
import {SafeAreaView, View} from 'react-native';

// styled를 이용해 NativeWind 스타일을 적용할 수 있도록 래핑
const StyledSafeAreaView = styled(SafeAreaView);
const StyledView = styled(View);

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  console.log('isDarkMode:', isDarkMode);

  return (
    <RecoilRoot>
      <SafeAreaView style={{flex: 1}}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={{flex: 1}}>
          <AppNavigator />
        </View>
      </SafeAreaView>
    </RecoilRoot>
  );
}

export default App;
