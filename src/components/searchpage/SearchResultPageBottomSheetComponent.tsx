import React from 'react';
import {View, Text, Button, HStack} from 'native-base';
import {useNavigation} from '@react-navigation/native';
import {useRecoilValue} from 'recoil';
import {DestinationState} from 'state/RouteAtoms';

const SearchResultPageBottomSheetComponent = () => {
  const destination = useRecoilValue(DestinationState); // Recoil에서 목적지 정보 가져오기
  const navigation = useNavigation();
  return (
    <View px={4} py={4} bg="white" position="absolute" bottom={0} width="100%">
      <Text fontSize="20" bold isTruncated>
        {destination.name}
      </Text>
      <Text fontSize={'16'} color="gray.500" isTruncated>
        {destination.address}
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
            navigation.navigate('Route'); // RoutePage로 이동
          }}>
          도착지로 선택하기
        </Button>
      </HStack>
    </View>
  );
};

export default SearchResultPageBottomSheetComponent;
