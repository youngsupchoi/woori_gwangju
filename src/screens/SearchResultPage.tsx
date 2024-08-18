import React from 'react';
import {View, Text, Button, HStack, Image} from 'native-base';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Dimensions, TouchableOpacity} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import LeftChevron from '../assets/images/leftChevron.png';
import CloseButton from '../assets/images/closeIcon.png';

const SearchResultPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {latitude, longitude, name, address} = route.params;

  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.005;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  return (
    <View flex={1} bg="white">
      {/* Header */}
      <HStack
        px={4}
        py={4}
        alignItems="center"
        justifyContent="space-between"
        bg="white"
        borderBottomWidth={1}
        borderBottomColor="gray.200">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={LeftChevron}
            alt="back"
            width={'32px'}
            height={'32px'}
          />
          {/* <Icon as={MaterialIcons} name="arrow-back" size={6} /> */}
        </TouchableOpacity>
        <Text fontSize="18" bold isTruncated maxWidth="80%">
          {name}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Main')}>
          <Image
            source={CloseButton}
            alt="close"
            width={'24px'}
            height={'24px'}
          />
        </TouchableOpacity>
      </HStack>

      {/* 지도 */}
      <MapView
        style={{flex: 1}}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}>
        <Marker coordinate={{latitude, longitude}} title={name} />
      </MapView>

      {/* 하단 정보 */}
      <View
        px={4}
        py={4}
        bg="white"
        position="absolute"
        bottom={0}
        width="100%">
        <Text fontSize="20" bold isTruncated>
          {name}
        </Text>
        <Text fontSize={'16'} color="gray.500" isTruncated>
          {address}
        </Text>

        <HStack space={4} mt={8}>
          <Button
            flex={1}
            bg={'#F0F0F3'}
            _text={{color: '#1C2024', fontSize: '16', fontWeight: 'semibold'}}
            borderRadius={'xl'}
            h={'56px'}
            onPress={() => navigation.goBack()}>
            돌아가기
          </Button>
          <Button
            flex={1}
            bg={'#113264'}
            _text={{color: '#ffffff', fontSize: '16', fontWeight: 'semibold'}}
            borderRadius={'xl'}
            h={'56px'}
            onPress={() => {
              /* 도착지로 선택 로직 추가 */
            }}>
            도착지로 선택하기
          </Button>
        </HStack>
      </View>
    </View>
  );
};

export default SearchResultPage;
