import React from 'react';
import {ScrollView, HStack, Button, Image} from 'native-base';

const FilterButtons = () => {
  const buttons = [
    {label: '버스', icon: require('../../assets/images/bus.png')},
    {label: '지하철', icon: require('../../assets/images/train.png')},
    {label: '장애인 화장실', icon: require('../../assets/images/people.png')},
    {label: '설정', icon: require('../../assets/images/settings.png')},
  ];

  return (
    <ScrollView
      horizontal
      h={'36px'}
      maxH={'36px'}
      mt={'18px'}
      //   bg={'gray.100'}
      p={0}
      showsHorizontalScrollIndicator={false}>
      <HStack space={4} justifyContent="flex-start" px={4} py={0}>
        {buttons.map((button, index) => (
          <Button
            key={index}
            variant="solid"
            bg="gray.100"
            alignItems={'center'}
            justifyContent={'center'}
            borderRadius="full"
            _focus={{bg: 'gray.200'}}
            _pressed={{bg: 'gray.300'}}
            py={0}
            _text={{color: 'black', fontSize: 'md', fontWeight: 'bold'}}
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
