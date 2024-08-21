import React from 'react';
import {HStack, Button, Image, Text} from 'native-base';
import BusIcon from 'assets/images/bus.png';
import SubwayIcon from 'assets/images/train.png';
import whiteBusIcon from 'assets/images/whiteBusIconWithBackground.png';
import {useRecoilState} from 'recoil';
import {SelectedTransportMethodState} from 'state/RouteAtoms';

const MethodFilterComponent = () => {
  const [selectedMethod, setSelectedMethod] = useRecoilState(
    SelectedTransportMethodState,
  );

  const handleFilterChange = (filter: string) => {
    setSelectedMethod(filter);
  };

  return (
    <HStack
      justifyContent="flex-start"
      space={'8px'}
      pl={'18px'}
      alignItems="center"
      pt={'16px'}>
      {['전체', '버스', '지하철', '버스+지하철'].map((filter, index) => {
        const isSelected = selectedMethod === filter;
        return (
          <Button
            key={index}
            variant={isSelected ? 'solid' : 'outline'}
            py={'4px'}
            px={'12px'}
            borderRadius="full"
            bg={isSelected ? '#0588F0' : 'white'}
            onPress={() => handleFilterChange(filter)}
            leftIcon={
              filter !== '전체' && filter !== '버스+지하철' && isSelected ? (
                <Image size={'24px'} alt={filter} source={whiteBusIcon} />
              ) : filter !== '전체' &&
                filter !== '버스+지하철' &&
                !isSelected ? (
                <Image
                  size={'24px'}
                  alt={filter}
                  source={filter === '버스' ? BusIcon : SubwayIcon}
                />
              ) : undefined
            }>
            <Text
              fontSize="16"
              fontWeight="bold"
              color={isSelected ? 'white' : 'black'}>
              {filter}
            </Text>
          </Button>
        );
      })}
    </HStack>
  );
};

export default MethodFilterComponent;
