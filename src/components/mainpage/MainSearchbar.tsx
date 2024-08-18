import React from 'react';
import {Input, Button, HStack, Image} from 'native-base';
import {useNavigation} from '@react-navigation/native';

const MainSearchBar = ({
  placeholder = '장소/주소 검색',
  onFocus,
  onChangeText,
  showBackButton = false,
  onBackPress,
  flex = 1,
}: {
  placeholder?: string;
  onFocus?: () => void;
  onChangeText?: (text: string) => void;
  showBackButton?: boolean;
  onBackPress?: () => void;
  flex?: number;
}) => {
  const navigation = useNavigation();

  return (
    <HStack alignItems="center" px={4} pt={4} space={2}>
      {showBackButton && (
        <Button
          variant="ghost"
          p={0}
          ml={'18px'}
          onPress={onBackPress || (() => navigation.goBack())}>
          <Image
            source={require('../../assets/images/leftChevron.png')}
            alt="back"
            width={'32px'}
            height={'32px'}
          />
        </Button>
      )}
      <Input
        placeholder={placeholder}
        flex={flex}
        bg="#FFFFFF"
        fontSize="18"
        fontWeight={'medium'}
        placeholderTextColor={'#8B8D98'}
        borderColor={'#E0E1E6'}
        borderRadius="full"
        py={3}
        px={3}
        pl={5}
        h={'56px'}
        color={'#11181C'}
        onFocus={onFocus}
        onChangeText={onChangeText}
        _focus={{
          borderColor: 'gray.100',
          backgroundColor: 'white',
        }}
        InputRightElement={
          <Button
            borderRadius={'full'}
            _pressed={{bg: 'gray.200'}}
            mr={2}
            onPress={() => navigation.navigate('VoiceSearch')}
            bg={'#F2F2F7'}>
            <Image
              source={require('../../assets/images/mic.png')}
              style={{width: 24, height: 24}}
              alt="mic"
            />
          </Button>
        }
      />
    </HStack>
  );
};

export default MainSearchBar;
