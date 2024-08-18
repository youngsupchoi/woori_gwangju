import React from 'react';
import {RecoilRoot} from 'recoil';
import {StatusBar, useColorScheme} from 'react-native';
import AppNavigator from './src/navigation';
import {SafeAreaView, View} from 'react-native';
import {NativeBaseProvider} from 'native-base';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NativeBaseProvider>
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
