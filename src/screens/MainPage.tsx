import React from 'react';
import {Button, VStack, Image} from 'native-base';
import targetIcon from '../assets/images/target.png';
import FilterButtons from 'components/mainpage/FilterButtons';
import MainMapComponent from 'components/mainpage/MainMapComponent';
import MainSearchBar from 'components/mainpage/MainSearchbar';
import {useNavigation} from '@react-navigation/native';

const MainPage = () => {
  const navigation = useNavigation();

  return (
    <VStack flex={1} bg="blue.400" p={0} m={0}>
      {/* 검색 바 */}
      <MainSearchBar
        onFocus={() => navigation.navigate('Search')}
        flex={1}
        showMenuButton={true}
      />

      {/* 필터 버튼들 */}
      <FilterButtons />

      {/* 지도 Placeholder */}
      <MainMapComponent />

      {/* 위치 버튼 */}
      <Button
        position={'absolute'}
        bottom={30}
        right={0}
        p={'10px'}
        m={18}
        _focus={{bg: 'gray.200'}}
        _pressed={{bg: 'gray.300'}}
        bg={'gray.100'}
        borderRadius={'full'}>
        <Image
          source={targetIcon}
          alt="target"
          style={{width: 28, height: 28}}
        />
      </Button>
    </VStack>
  );
};

export default MainPage;
