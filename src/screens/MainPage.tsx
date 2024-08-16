import React from 'react';
// import {View} from 'react-native';
import {
  Input,
  HStack,
  Button,
  VStack,
  View,
  Image,
  ScrollView,
} from 'native-base';
// import {MaterialIcons} from '@expo/vector-icons';
import micIcon from '../assets/images/mic.png';
import busIcon from '../assets/images/bus.png';
import trainIcon from '../assets/images/train.png';
import peopleIcon from '../assets/images/people.png';
import settingsIcon from '../assets/images/settings.png';
import targetIcon from '../assets/images/target.png';
import {useNavigation} from '@react-navigation/native';

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
      <ScrollView
        horizontal
        maxH={'20'}
        bg={'gray.400'}
        showsHorizontalScrollIndicator={false}
        py={5}>
        <HStack space={4} justifyContent="flex-start" px={4}>
          <Button
            variant="solid"
            bg="gray.100"
            alignItems={'center'}
            justifyContent={'center'}
            borderRadius="full"
            _focus={{bg: 'gray.200'}}
            _pressed={{bg: 'gray.300'}}
            _text={{color: 'black', fontSize: 'md', fontWeight: 'bold'}}
            leftIcon={
              <Image
                source={busIcon}
                alt="bus"
                style={{width: 24, height: 24}}
              />
            }>
            버스
          </Button>
          <Button
            variant="solid"
            bg="gray.100"
            alignItems={'center'}
            justifyContent={'center'}
            borderRadius="full"
            _focus={{bg: 'gray.200'}}
            _pressed={{bg: 'gray.300'}}
            _text={{color: 'black', fontSize: 'md', fontWeight: 'bold'}}
            leftIcon={
              <Image
                source={trainIcon}
                alt="bus"
                style={{width: 24, height: 24}}
              />
            }>
            지하철
          </Button>
          <Button
            variant="solid"
            bg="gray.100"
            alignItems={'center'}
            justifyContent={'center'}
            borderRadius="full"
            _focus={{bg: 'gray.200'}}
            _pressed={{bg: 'gray.300'}}
            _text={{color: 'black', fontSize: 'md', fontWeight: 'bold'}}
            leftIcon={
              <Image
                source={peopleIcon}
                alt="bus"
                style={{width: 24, height: 24}}
              />
            }>
            장애인 화장실
          </Button>
          <Button
            variant="solid"
            bg="gray.100"
            alignItems={'center'}
            justifyContent={'center'}
            borderRadius="full"
            _focus={{bg: 'gray.200'}}
            _pressed={{bg: 'gray.300'}}
            _text={{color: 'black', fontSize: 'md', fontWeight: 'bold'}}
            leftIcon={
              <Image
                source={settingsIcon}
                alt="bus"
                style={{width: 24, height: 24}}
              />
            }>
            설정
          </Button>
        </HStack>
      </ScrollView>

      {/* 지도 Placeholder */}
      <View
        flex={1}
        position={'absolute'}
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={-1}
        bg="gray.300"
        opacity={0.5}
      />
      <Button
        position={'absolute'}
        bottom={30}
        right={0}
        p={'10px'}
        m={18}
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
