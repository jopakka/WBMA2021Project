import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import {Text} from 'react-native-elements';
import GlobalStyles from '../styles/GlobalStyles';
import {StatusBar} from 'expo-status-bar';
import {colors} from '../utils/variables';
import {SafeAreaView} from 'react-native';

const Login = ({navigation}) => {
  const {setIsLoggedIn, setUser} = useContext(MainContext);
  const [formToggle, setFormToggle] = useState(true);
  const {checkToken} = useUser();

  const getToken = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    // console.log('token', userToken);
    if (userToken) {
      try {
        const userData = await checkToken(userToken);
        setIsLoggedIn(true);
        setUser(userData);
        navigation.navigate('Home');
      } catch (error) {
        console.log('token check failed', error.message);
      }
    }
  };

  const formToggleAction = () => setFormToggle(!formToggle);

  useEffect(() => {
    getToken();
  }, []);

  return (
    <KeyboardAvoidingView
      style={GlobalStyles.droidSafeArea}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      enabled
    >
      <SafeAreaView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={GlobalStyles.scrollView}>
            <View style={GlobalStyles.appTitleContainer}>
              <Text style={GlobalStyles.appTitle}>Officium</Text>
            </View>
            {formToggle ? (
              <LoginForm
                navigation={navigation}
                formToggle={formToggleAction}
              />
            ) : (
              <RegisterForm
                navigation={navigation}
                formToggle={formToggleAction}
              />
            )}
          </ScrollView>
        </TouchableWithoutFeedback>
        <StatusBar style="light" backgroundColor={colors.statusbar} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

Login.propTypes = {
  navigation: PropTypes.object,
};

export default Login;
