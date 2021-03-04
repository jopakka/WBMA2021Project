import React, {useContext} from 'react';
import {Alert, View} from 'react-native';
import {Text} from 'react-native-elements';
import PropTypes from 'prop-types';
import FormTextInput from './FormTextInput';
import useLogInForm from '../hooks/LoginHooks';
import {useLogin} from '../hooks/ApiHooks';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {parse} from '../utils/helpers';
import TextBoxStyles from '../styles/TextBoxStyles';
import ListButtonElement from './ListButtonElement';
import NiceDivider from './NiceDivider';
import GlobalStyles from '../styles/GlobalStyles';

const LoginForm = ({navigation, formToggle = () => {}}) => {
  const {inputs, handleInputChange} = useLogInForm();
  const {postLogin} = useLogin();
  const {setUser, setIsLoggedIn, setUserToken} = useContext(MainContext);

  const doLogin = async () => {
    try {
      const userData = await postLogin(inputs);
      // console.log('doLogin ok', userData.message);
      // Alert.alert(userData.message);
      setUser(parse(userData.user, 'full_name'));
      setIsLoggedIn(true);
      setUserToken(userData.token);
      await AsyncStorage.setItem('userToken', userData.token);
    } catch (error) {
      // console.log('Login error', error.message);
      Alert.alert('Login error', error.message);
    }
  };

  return (
    <>
      <View style={[TextBoxStyles.box, TextBoxStyles.paddingBox]}>
        <Text
          style={[
            TextBoxStyles.text,
            TextBoxStyles.title,
            GlobalStyles.loginTitle,
          ]}
        >
          Login
        </Text>
        <NiceDivider />

        <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>Username</Text>
        <FormTextInput
          autoCapitalize="none"
          placeholder="Username"
          onChangeText={(txt) => handleInputChange('username', txt)}
        />

        <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>Password</Text>
        <FormTextInput
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={(txt) => handleInputChange('password', txt)}
          secureTextEntry={true}
        />
      </View>

      <NiceDivider lineHeight={0} color="#FFF0" />

      <View style={TextBoxStyles.box}>
        <ListButtonElement text="Sign in!" onPress={doLogin} />
        <NiceDivider
          space={0}
          style={{
            marginStart: 20,
            marginEnd: 20,
          }}
        />
        <ListButtonElement
          text="No account? Register here."
          onPress={formToggle}
        />
      </View>
    </>
  );
};

LoginForm.propTypes = {
  navigation: PropTypes.object,
  formToggle: PropTypes.func,
};

export default LoginForm;
