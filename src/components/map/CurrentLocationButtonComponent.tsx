import React from 'react';
import {Button, Image} from 'native-base';
import targetIcon from '../../assets/images/target.png';

const CurrentLocationButtonComponent: React.FC<{
  onPressFunction: (zoomLevel: number) => void;
}> = ({onPressFunction}) => {
  return (
    <Button
      position={'absolute'}
      bottom={30}
      right={0}
      p={'10px'}
      m={18}
      _focus={{bg: 'gray.200'}}
      _pressed={{bg: 'gray.300'}}
      bg={'gray.100'}
      borderRadius={'full'}
      onPress={() => onPressFunction(20)}>
      <Image source={targetIcon} alt="target" style={{width: 28, height: 28}} />
    </Button>
  );
};
export default CurrentLocationButtonComponent;
