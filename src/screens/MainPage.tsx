import React from 'react';
// import {View} from 'react-native';
import {Input, HStack, Button, VStack, View, Image} from 'native-base';
import micIcon from '../assets/images/mic.png';
import targetIcon from '../assets/images/target.png';
import {useNavigation} from '@react-navigation/native';
import FilterButtons from 'components/mainpage/FilterButtons';
import MainMapComponent from 'components/mainpage/MainMapComponent';

const MainPage = () => {
  const navigation = useNavigation();
  return (
    <VStack flex={1} bg="blue.400" p={0} m={0}>
      {/* 검색 바 */}
      <HStack space={2} alignItems="center" px={4} pt={4}>
        <Input
          placeholder="장소/주소 검색"
          width="100%"
          bg="gray.100"
          pl={5}
          borderRadius="full"
          py={3}
          px={3}
          h={'56px'}
          fontSize="18"
          onFocus={() => navigation.navigate('Search')} // SearchPage로 이동
          fontWeight={'bold'}
          placeholderTextColor={'gray.400'}
          color={'gray.400'}
          borderColor={'gray.100'}
          _focus={{
            borderColor: 'gray.100',
            backgroundColor: 'white',
          }}
          InputRightElement={
            <Button borderRadius={'full'} mr={2} bg={'gray.200'}>
              <Image
                source={micIcon}
                style={{width: 24, height: 24}}
                alt="mic"
              />
            </Button>
          }
        />
      </HStack>

      {/* 필터 버튼들 */}
      <FilterButtons />

      {/* 지도 Placeholder */}
      <MainMapComponent />

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
