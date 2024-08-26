import React from 'react';
import {ScrollView, HStack, Button, Image} from 'native-base';
import busIcon from 'assets/images/bus.png';
import subwayIcon from 'assets/images/train.png';
import peopleIcon from 'assets/images/people.png';
import disabledIcon from 'assets/images/disabled.png';
import settingsIcon from 'assets/images/settings.png';
import {useRecoilState} from 'recoil';
import {ShowMarkerState} from 'state/HomeMapAtoms';
import {useNavigation} from '@react-navigation/native';

const FilterButtons = () => {
  const [showMarkerState, setShowMarkerState] = useRecoilState(ShowMarkerState);
  const navigation = useNavigation();

  const toggleMarker = label => {
    setShowMarkerState(prevState => {
      // 이미 존재하는 경우 제거, 존재하지 않으면 추가
      if (prevState.includes(label)) {
        return prevState.filter(item => item !== label);
      } else {
        return [...prevState, label];
      }
    });
  };

  const getButtonStyle = label => {
    if (label === '장애인 화장실' && showMarkerState.includes(label)) {
      return {borderColor: '#E93D82', backgroundColor: '#FEF7F9'};
    }
    if (label === '공중화장실' && showMarkerState.includes(label)) {
      return {borderColor: '#1C2024', backgroundColor: '#FFFFFF'};
    }
    if (label === '버스' && showMarkerState.includes(label)) {
      return {borderColor: '#34C759', backgroundColor: '#F4FBF6'};
    }
    if (label === '지하철' && showMarkerState.includes(label)) {
      return {borderColor: '#0090FF', backgroundColor: '#F4FAFF'};
    }
    return {borderColor: 'gray.100', backgroundColor: 'gray.100'}; // 기본 스타일
  };

  const buttons = [
    {
      label: '장애인 화장실',
      icon: disabledIcon,
      onPress: () => toggleMarker('장애인 화장실'),
    },
    {
      label: '공중화장실',
      icon: peopleIcon,
      onPress: () => toggleMarker('공중화장실'),
    },
    {label: '버스', icon: busIcon, onPress: () => toggleMarker('버스')},
    {label: '지하철', icon: subwayIcon, onPress: () => toggleMarker('지하철')},
    {
      label: '설정',
      icon: settingsIcon,
      onPress: () => navigation.navigate('Onboarding'),
    },
  ];

  return (
    <ScrollView
      horizontal
      h={'36px'}
      maxH={'36px'}
      mt={'18px'}
      mb={'12px'}
      p={0}
      showsHorizontalScrollIndicator={false}>
      <HStack space={4} justifyContent="flex-start" px={4} py={0}>
        {buttons.map((button, index) => (
          <Button
            key={index}
            variant="solid"
            alignItems={'center'}
            justifyContent={'center'}
            borderRadius="full"
            borderWidth={1}
            borderColor={getButtonStyle(button.label).borderColor}
            bg={getButtonStyle(button.label).backgroundColor}
            _focus={{bg: 'gray.200'}}
            _pressed={{bg: 'gray.300'}}
            py={0}
            _text={{color: 'black', fontSize: 'md', fontWeight: 'bold'}}
            onPress={button.onPress}
            leftIcon={
              <Image
                source={button.icon}
                alt={button.label}
                style={{width: 24, height: 24}}
              />
            }>
            {button.label}
          </Button>
        ))}
      </HStack>
    </ScrollView>
  );
};

export default FilterButtons;
