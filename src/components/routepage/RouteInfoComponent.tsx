import React from 'react';
import {VStack, Button, Image, Text, HStack, View} from 'native-base';
import ArrowBothIcon from 'assets/images/arrowBoth.png';
import {useRecoilState} from 'recoil';
import {DestinationState, StartPointState} from 'state/RouteAtoms';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const LocationRow = ({type, label, navigation, isDestination}) => (
  <HStack
    space={2}
    alignItems={'center'}
    bg={'#F9F9FB'}
    w={'full'}
    py={'12px'}
    px={'24px'}
    borderTopRadius={type === '출발지' ? '12px' : 0}
    borderBottomRadius={type === '도착지' ? '12px' : 0}
    borderColor={'#D9D9E0'}
    borderWidth={1}>
    <TouchableOpacity
      onPress={() => {
        console.log('isDestination: ', isDestination);
        navigation.navigate('Search', {
          isDestination: isDestination,
          isReset: true,
        });
      }}
      style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
      <View
        borderColor={type === '출발지' ? '#80838D' : '#0090FF'}
        borderWidth={'1px'}
        size={'8px'}
        borderRadius={'full'}
        bg={type === '출발지' ? 'transparent' : '#0090FF'}
      />
      <Text
        fontSize="18px"
        fontWeight="regular"
        color={label === '출발지' || label === '도착지' ? 'gray.500' : 'black'}
        isTruncated>
        {label}
      </Text>
    </TouchableOpacity>
  </HStack>
);

const RouteInfoComponent = () => {
  const [startPointState, setStartPointState] = useRecoilState(StartPointState);
  const [destinationState, setDestinationState] =
    useRecoilState(DestinationState);
  const navigation = useNavigation();

  // 출발지와 도착지 스왑 함수
  const swapLocations = () => {
    const temp = startPointState;
    setStartPointState(destinationState);
    setDestinationState(temp);
  };

  return (
    <VStack
      p={'18px'}
      position={'relative'}
      alignItems="flex-start"
      justifyContent="center"
      borderBottomWidth={1}
      borderRadius={'12px'}
      borderBottomColor="gray.200">
      <LocationRow
        label={startPointState.address || '출발지'}
        type={'출발지'}
        navigation={navigation}
        isDestination={false}
      />
      <Button
        position={'absolute'}
        zIndex={1}
        w={'40px'}
        h={'40px'}
        borderRadius={'full'}
        right={'30px'}
        _pressed={{bg: 'gray.200'}}
        bg={'#fff'}
        borderColor={'#D9D9E0'}
        borderWidth={1}
        onPress={swapLocations}>
        <Image source={ArrowBothIcon} alt="arrow" size="20px" />
      </Button>
      <LocationRow
        label={destinationState.address || '도착지'}
        type={'도착지'}
        navigation={navigation}
        isDestination={true}
      />
    </VStack>
  );
};

export default RouteInfoComponent;
