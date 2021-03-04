import React, {useContext, useState} from 'react';
import {View, Alert} from 'react-native';
import {Text, CheckBox} from 'react-native-elements';
import PropTypes from 'prop-types';
import useSignUpForm from '../hooks/RegisterHooks';
import {useLogin, useUser} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {MainContext} from '../contexts/MainContext';
import {colors, uploadsUrl} from '../utils/variables';
import FormTextInput from './FormTextInput';
import FormStyles from '../styles/FormStyles';
import NiceDivider from './NiceDivider';
import ListButtonElement from './ListButtonElement';
import TextBoxStyles from '../styles/TextBoxStyles';
import GlobalStyles from '../styles/GlobalStyles';
import LoadingModal from './LoadingModal';

const RegisterForm = ({navigation, formToggle = () => {}}) => {
  const [loading, setLoading] = useState(false);
  const [employer, setEmpoyer] = useState(false);
  const {setIsLoggedIn, setUser, setUserToken} = useContext(MainContext);
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
      // console.log('FormData', formData);
      const data = {
        ...inputs,
        full_name: JSON.stringify(otherData),
      };
      try {
        await postRegister(data);
        // automatic login after register
        const userData = await postLogin(inputs);
        setUserToken(userData.token);
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
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <LoadingModal visible={loading} />
      <View style={[TextBoxStyles.box, TextBoxStyles.paddingBox]}>
        <Text
          style={[
            TextBoxStyles.text,
            TextBoxStyles.title,
            GlobalStyles.loginTitle,
          ]}
        >
          Register
        </Text>
        <NiceDivider />

        <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>Username</Text>
        <FormTextInput
          autoCapitalize="none"
          placeholder="Username"
          onChangeText={(txt) => handleInputChange('username', txt)}
          onEndEditing={(event) => {
            checkUserAvailable(event);
            handleInputEnd('username', event.nativeEvent.text);
          }}
          errorMessage={registerErrors.username}
        />

        <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>Password</Text>
        <FormTextInput
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={(txt) => handleInputChange('password', txt)}
          secureTextEntry={true}
          onEndEditing={(event) => {
            handleInputEnd('password', event.nativeEvent.text);
          }}
          errorMessage={registerErrors.password}
        />

        <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>
          Confirm Password
        </Text>
        <FormTextInput
          autoCapitalize="none"
          placeholder="Confirm password"
          onChangeText={(txt) => handleInputChange('confirmPassword', txt)}
          secureTextEntry={true}
          onEndEditing={(event) => {
            handleInputEnd('confirmPassword', event.nativeEvent.text);
          }}
          errorMessage={registerErrors.confirmPassword}
        />

        <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>Email</Text>
        <FormTextInput
          autoCapitalize="none"
          placeholder="email"
          onChangeText={(txt) => handleInputChange('email', txt)}
          onEndEditing={(event) => {
            handleInputEnd('email', event.nativeEvent.text);
          }}
          errorMessage={registerErrors.email}
        />

        <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>Full Name</Text>
        <FormTextInput
          autoCapitalize="words"
          placeholder="Full Name"
          onChangeText={(txt) => handleInputChange('full_name', txt)}
          onEndEditing={(event) => {
            handleInputEnd('full_name', event.nativeEvent.text);
          }}
          errorMessage={registerErrors.full_name}
        />

        <CheckBox
          checked={employer}
          title="Employer"
          onPress={() => setEmpoyer(!employer)}
          textStyle={FormStyles.checkText}
          containerStyle={FormStyles.check}
          checkedColor={colors.accent}
        />
      </View>

      <NiceDivider lineHeight={0} color="#FFF0" />

      <View style={TextBoxStyles.box}>
        <ListButtonElement text="Register!" onPress={doRegister} />
        <NiceDivider
          space={0}
          style={{
            marginStart: 20,
            marginEnd: 20,
          }}
        />
        <ListButtonElement
          text="Already registered? Login here."
          onPress={formToggle}
        />
      </View>
    </>
  );
};
RegisterForm.propTypes = {
  navigation: PropTypes.object,
  formToggle: PropTypes.func,
};
export default RegisterForm;
