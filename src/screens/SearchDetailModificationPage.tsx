import React from 'react';
import {View, Text, Button} from 'react-native';
import {styled} from 'nativewind';

const StyledView = styled(View);
const StyledButton = styled(Button);

const SearchDetailModificationPage = () => {
  return (
    <StyledView className="flex-1 p-4">
      <Text>Modification Details</Text>
      <StyledButton
        title="Save Modifications"
        onPress={() => {
          /* Handle save */
        }}
      />
      {/* Modification detail components */}
    </StyledView>
  );
};

export default SearchDetailModificationPage;
