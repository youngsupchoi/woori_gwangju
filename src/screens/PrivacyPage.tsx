import React from 'react';
import {Button, HStack, Image, View, Text, VStack} from 'native-base';
import LeftChevron from 'assets/images/leftChevron.png';
import CloseIcon from 'assets/images/closeIcon.png';
import {useNavigation} from '@react-navigation/native';

const HeaderComponent = ({onBackPress, title}) => (
  <HStack
    px={4}
    h={'56px'}
    alignItems="center"
    justifyContent="space-between"
    bg="white"
    borderBottomWidth={1}
    borderBottomColor="gray.200">
    <Button
      variant="ghost"
      onPress={onBackPress}
      _pressed={{backgroundColor: 'transparent'}}>
      <Image source={LeftChevron} alt="back" width={'24px'} height={'24px'} />
    </Button>
    <Text fontFamily={'mono'} fontSize="18" bold isTruncated maxWidth="80%">
      {title}
    </Text>
    <Button
      variant="ghost"
      _pressed={{backgroundColor: 'transparent'}}></Button>
  </HStack>
);

const PrivacyPage = () => {
  const navigation = useNavigation();
  return (
    <VStack>
      <HeaderComponent
        onBackPress={() => {
          navigation.goBack();
        }}
        title={'개인정보처리방침'}
      />
      <Text>PrivacyPage</Text>
    </VStack>
  );
};

export default PrivacyPage;
