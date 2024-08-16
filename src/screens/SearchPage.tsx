import React from 'react';
import {
  VStack,
  HStack,
  Text,
  Button,
  ScrollView,
  Input,
  Icon,
  Divider,
  Image,
  View,
} from 'native-base';
import {useRecoilState} from 'recoil';
import {recentSearchesState} from 'state/SearchAtoms';
import {useNavigation} from '@react-navigation/native';
// import {MaterialIcons} from '@expo/vector-icons';
import LeftChevron from '../assets/images/leftChevron.png';
import micIcon from '../assets/images/mic.png';
import busIcon from '../assets/images/bus.png';
import trainIcon from '../assets/images/train.png';
import peopleIcon from '../assets/images/people.png';
import settingsIcon from '../assets/images/settings.png';
import historyIcon from '../assets/images/history.png';

const SearchPage = () => {
  const [recentSearches, setRecentSearches] =
    useRecoilState(recentSearchesState);
  const navigation = useNavigation();

  return (
    <VStack flex={1} bg="white" p={0} m={0}>
      {/* 검색 바 */}
      <HStack space={2} alignItems="center" mb={4}>
        <Button variant="ghost" onPress={() => navigation.goBack()}>
          {/* <Icon as={MaterialIcons} name="arrow-back" size={6} /> */}
          <Image source={LeftChevron} alt="back" width={'8'} height={'8'} />
        </Button>
        {/* <Input
          placeholder="장소 검색하기"
          width="85%"
          bg="gray.100"
          pl={5}
          borderRadius="full"
          py={3}
          fontSize="18"
          InputRightElement={
            <Button borderRadius={'full'} mr={2} bg={'gray.200'}>
              <Icon as={MaterialIcons} name="mic" size={6} />
            </Button>
          }
        /> */}
        <Input
          placeholder="장소/주소 검색"
          width="85%"
          bg="gray.100"
          pl={5}
          borderRadius="full"
          py={3}
          px={3}
          h={'56px'}
          fontSize="18"
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
        h={'20'}
        bg={'gray.300'}
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

      <Text fontSize="md" bold mb={2}>
        최근 검색
      </Text>
      <ScrollView>
        {recentSearches.map((item, index) => (
          <VStack key={index} space={2} mb={4}>
            <HStack space={2} px={4} py={2}>
              <Image
                source={historyIcon}
                alt="history"
                width={'6'}
                height={'6'}
              />
              <VStack justifyContent="space-between" alignItems="flex-start">
                <HStack space={2}>
                  <Text fontSize={18} fontWeight={'regular'}>
                    {item.name}
                  </Text>
                  <View
                    px={2}
                    bg={'gray.200'}
                    borderRadius={'sm'}
                    alignItems={'center'}
                    justifyContent={'center'}>
                    <Text color="gray.500">{item.distance}</Text>
                  </View>
                </HStack>
                <Text color="gray.500">{item.address}</Text>
              </VStack>
            </HStack>
            <Divider />
          </VStack>
        ))}
      </ScrollView>
    </VStack>
  );
};

export default SearchPage;
