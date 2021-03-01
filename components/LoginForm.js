import React, {useContext} from 'react';
import {Alert, View} from 'react-native';
import {Text, Button} from 'react-native-elements';
import PropTypes from 'prop-types';
import FormTextInput from './FormTextInput';
import useLogInForm from '../hooks/LoginHooks';
import {useLogin} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {parse} from '../utils/helpers';

const LoginForm = ({navigation}) => {
  const {inputs, handleInputChange} = useLogInForm();
  const {postLogin} = useLogin();
  const {setUser, setIsLoggedIn, setUserToken} = useContext(MainContext);

  const doLogin = async () => {
    try {
      const userData = await postLogin(inputs);
      console.log('doLogin ok', userData.message);
      Alert.alert(userData.message);
      setUser(parse(userData.user, 'full_name'));
      setIsLoggedIn(true);
      setUserToken(userData.token);
      await AsyncStorage.setItem('userToken', userData.token);
    } catch (error) {
      console.log('Login error', error.message);
      Alert.alert('Login error', error.message);
    }
  };

  return (
    <View>
      <FormTextInput
        autoCapitalize="none"
        placeholder="username"
        onChangeText={(txt) => handleInputChange('username', txt)}
      />
      <FormTextInput
        autoCapitalize="none"
        placeholder="password"
        onChangeText={(txt) => handleInputChange('password', txt)}
        secureTextEntry={true}
      />
      <Button title="Sign in!" onPress={doLogin} />
    </View>
  );
};
LoginForm.propTypes = {
  navigation: PropTypes.object,
};
export default LoginForm;
