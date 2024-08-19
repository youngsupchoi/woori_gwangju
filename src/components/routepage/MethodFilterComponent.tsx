import React from 'react';
import {HStack, Button, Image, Text} from 'native-base';
import BusIcon from 'assets/images/bus.png';
import SubwayIcon from 'assets/images/train.png';

const MethodFilterComponent = () => (
  <HStack
    justifyContent="flex-start"
    space={'8px'}
    pl={'18px'}
    alignItems="center"
    pt={'16px'}>
    {['전체', '버스', '지하철', '버스+지하철'].map((filter, index) => (
      <Button
        key={index}
        variant="outline"
        py={'4px'}
        px={'12px'}
        borderRadius="full"
        leftIcon={
          filter !== '전체' ? (
            <Image
              size={'24px'}
              alt={filter}
              source={filter === '버스' ? BusIcon : SubwayIcon}
            />
          ) : null
        }
        bg="white">
        <Text fontSize="16" fontWeight="bold" color="black">
          {filter}
        </Text>
      </Button>
    ))}
  </HStack>
);

export default MethodFilterComponent;
