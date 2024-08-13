import React from 'react';
import {View, TextInput, Button} from 'react-native';
import {styled} from 'nativewind';

const StyledView = styled(View);
const StyledTextInput = styled(TextInput);
const StyledButton = styled(Button);

const SearchPage = () => {
  return (
    <StyledView className="p-4">
      <StyledTextInput className="border p-2 mb-4" placeholder="Search..." />
      <StyledButton
        title="Search"
        onPress={() => {
          /* Handle search */
        }}
      />
      {/* Additional search components */}
    </StyledView>
  );
};

export default SearchPage;
