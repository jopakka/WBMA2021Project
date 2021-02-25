import React, {useContext, useState} from 'react';
import {View, Alert} from 'react-native';
import {Text, Button, Input, CheckBox} from 'react-native-elements';
import PropTypes from 'prop-types';
import useSignUpForm from '../hooks/RegisterHooks';
import {useLogin, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {uploadsUrl} from '../utils/variables';

const RegisterForm = ({navigation}) => {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
  const [employer, setEmpoyer] = useState(false);
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const {
    inputs,
    handleInputChange,
    handleInputEnd,
    checkUserAvailable,
    registerErrors,
    validateOnSend,
  } = useSignUpForm();
  const {postRegister} = useUser();
  const {postLogin} = useLogin();
  const formData = new FormData();
  const doRegister = async () => {
    setLoading(true);
    const otherData = {
      full_name: inputs.full_name,
      employer: employer,
      avatar: `${uploadsUrl}ca41a9b6c2671dcc58af87829095368d.png`,
    };

    if (!validateOnSend()) {
      Alert.alert('Input validation failed');
      console.log('validateOnSend failed');
      return;
    } else {
      delete inputs.confirmPassword;
      console.log('FormData', formData);
      const data = {
        ...inputs,
        full_name: JSON.stringify(otherData),
      };
      try {
        const result = await postRegister(data);
        console.log('doRegister ok', result.message);
        Alert.alert(result.message);
        // automatic login after register
        const userData = await postLogin(inputs);
        await AsyncStorage.setItem('userToken', userData.token);
        setIsLoggedIn(true);
        const newUser = {
          ...userData.user,
          ...otherData,
        };
        setUser(newUser);
      } catch (error) {
        console.log('Registration error', error.message);
        Alert.alert('Registration failed', error.message);
        setLoading(false);
      }
    }
  };

  return (
    <View>
      <Input
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
        onEndEditing={(event) => {
          checkUserAvailable(event);
          handleInputEnd('username', event.nativeEvent.text);
        }}
        errorMessage={registerErrors.username}
      />
      <Input
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
        onEndEditing={(event) => {
          handleInputEnd('password', event.nativeEvent.text);
        }}
        errorMessage={registerErrors.password}
      />
      <Input
        autoCapitalize="none"
        placeholder="confirm password"
        onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
        secureTextEntry={true}
        onEndEditing={(event) => {
          handleInputEnd('confirmPassword', event.nativeEvent.text);
        }}
        errorMessage={registerErrors.confirmPassword}
      />
      <Input
        autoCapitalize="none"
        placeholder="email"
        onChangeText={(txt) => handleInputChange('email', txt)}
        onEndEditing={(event) => {
          handleInputEnd('email', event.nativeEvent.text);
        }}
        errorMessage={registerErrors.email}
      />
      <Input
        autoCapitalize="none"
        placeholder="full name"
        onChangeText={(txt) => handleInputChange('full_name', txt)}
        onEndEditing={(event) => {
          handleInputEnd('full_name', event.nativeEvent.text);
        }}
        errorMessage={registerErrors.full_name}
      />
      <CheckBox
        checked={employer}
        title="Employer?"
        onPress={() => {
          setEmpoyer(!employer);
        }}
      />
      {<Button title="Register!" onPress={doRegister} />}
    </View>
  );
};
RegisterForm.propTypes = {
  navigation: PropTypes.object,
};
export default RegisterForm;
