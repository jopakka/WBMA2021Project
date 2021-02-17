import React, {useContext, useState} from 'react';
import {View, Alert} from 'react-native';
import {Text, Button, Input} from 'react-native-elements';
import PropTypes from 'prop-types';
import useSignUpForm from '../hooks/RegisterHooks';
import {useLogin, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';

const RegisterForm = ({navigation}) => {
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);
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

  const doRegister = async () => {
    setLoading(true);
    if (!validateOnSend()) {
      Alert.alert('Input validation failed');
      console.log('validateOnSend failed');
      return;
    } else {
      delete inputs.confirmPassword;
      try {
        const result = await postRegister(inputs);
        console.log('doRegister ok', result.message);
        Alert.alert(result.message);
        // automatic login after register
        const userData = await postLogin(inputs);
        await AsyncStorage.setItem('userToken', userData.token);
        setIsLoggedIn(true);
        setUser(userData.user);
      } catch (error) {
        console.log('Registration error', error.message);
        Alert.alert('Registration failed', error.message);
        setLoading(false);
      }
    }
  };

  return (
    <View>
      <Text style={{textAlign: 'center'}} h3>
        Register
      </Text>
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
      {<Button title="Register!" onPress={doRegister} />}
    </View>
  );
};
RegisterForm.propTypes = {
  navigation: PropTypes.object,
};
export default RegisterForm;
