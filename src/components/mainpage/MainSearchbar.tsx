import React from 'react';
import {Input, Button, HStack, Image} from 'native-base';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import hamburgerMenuIcon from 'assets/images/hamburgerMenuIcon.png';
import leftChevronIcon from 'assets/images/leftChevron.png';
import mic from 'assets/images/mic.png';
import {ShowDrawerMenuState} from '../../state/HomeMapAtoms';
import {useRecoilState} from 'recoil';

const MainSearchBar = ({
  placeholder = '장소/주소 검색',
  onFocus,
  onChangeText,
  showBackButton = false,
  showMenuButton = false,
  onBackPress,
  flex = 1,
}: {
  placeholder?: string;
  onFocus?: () => void;
  onChangeText?: (text: string) => void;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  onBackPress?: () => void;
  flex?: number;
}) => {
  const navigation = useNavigation();
  const [showDrawerMenuState, setShowDrawerMenuState] =
    useRecoilState(ShowDrawerMenuState);

  const toggleDrawer = () => {
    setShowDrawerMenuState(!showDrawerMenuState);
    if (!showDrawerMenuState) {
      navigation.dispatch(DrawerActions.openDrawer());
    } else {
      navigation.dispatch(DrawerActions.closeDrawer());
    }
  };

  return (
    <HStack alignItems="center" px={4} pt={4} space={2}>
      {showBackButton && (
        <Button
          variant="ghost"
          p={0}
          ml={'18px'}
          onPress={onBackPress || (() => navigation.goBack())}>
          <Image
            source={leftChevronIcon}
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
        h={'56px'}
        color={'#11181C'}
        onFocus={onFocus}
        onChangeText={onChangeText}
        _focus={{
          borderColor: 'gray.100',
          backgroundColor: 'white',
        }}
        InputLeftElement={
          showMenuButton ? (
            <Button
              variant="ghost"
              onPress={toggleDrawer}
              ml={2}
              _pressed={{bg: 'transparent'}}>
              <Image source={hamburgerMenuIcon} size={'24px'} alt="menu" />
            </Button>
          ) : undefined
        }
        InputRightElement={
          <Button
            borderRadius={'full'}
            _pressed={{bg: 'gray.200'}}
            mr={2}
            onPress={() => navigation.navigate('VoiceSearch')}
            bg={'#F2F2F7'}>
            <Image source={mic} style={{width: 24, height: 24}} alt="mic" />
          </Button>
        }
      />
    </HStack>
  );
};

export default MainSearchBar;
