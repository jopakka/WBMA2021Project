import React from 'react';
import PropTypes from 'prop-types';
import {Input} from 'react-native-elements';
import FormStyles from '../styles/FormStyles';

const FormTextInput = ({style, ...otherProps}) => {
  return (
    <Input
      inputContainerStyle={FormStyles.formInputContainer}
      inputStyle={FormStyles.formInput}
      errorStyle={FormStyles.error}
      placeholderTextColor="#FFF9"
      style={style}
      {...otherProps}
    />
  );
};

FormTextInput.propTypes = {
  style: PropTypes.object,
};
export default FormTextInput;
