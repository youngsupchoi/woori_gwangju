import React from 'react';
import {HStack, Button, Image, Text} from 'native-base';
import LeftChevron from 'assets/images/leftChevron.png';
import CloseIcon from 'assets/images/closeIcon.png';
import {useRecoilState} from 'recoil';
import {SelectedMethodState} from 'state/RouteAtoms';
import {useNavigation} from '@react-navigation/native';

const MethodButton = ({method, isSelected, onPress}) => (
  <Button
    px={'16px'}
    py={'8px'}
    bg={isSelected ? 'white' : 'transparent'}
    borderRadius={'full'}
    borderColor={isSelected ? '#D9D9E0' : 'transparent'}
    borderWidth={1}
    _pressed={{backgroundColor: 'transparent'}}
    onPress={onPress}>
    <Text
      fontSize="18"
      fontWeight="bold"
      color={isSelected ? '#000000' : '#8B8D98'}>
      {method}
    </Text>
  </Button>
);

export const RouteHeader = () => {
  const [selectedMethodState, setSelectedMethodState] =
    useRecoilState(SelectedMethodState);
  const navigation = useNavigation();
  return (
    <HStack
      px={4}
      mt={'16px'}
      h={'56px'}
      alignItems="center"
      justifyContent="space-between">
      <Button variant="ghost" onPress={() => navigation.goBack()}>
        <Image source={LeftChevron} alt="back" width={'24px'} height={'24px'} />
      </Button>
      <HStack
        alignItems={'center'}
        bg={'#F0F0F3'}
        p={'6px'}
        borderRadius={'full'}>
        {['휠체어', '대중교통'].map(method => (
          <MethodButton
            key={method}
            method={method}
            isSelected={selectedMethodState === method}
            onPress={() => setSelectedMethodState(method)}
          />
        ))}
      </HStack>
      <Button variant="ghost" onPress={() => navigation.navigate('Main')}>
        <Image source={CloseIcon} alt="close" width={'24px'} height={'24px'} />
      </Button>
    </HStack>
  );
};
