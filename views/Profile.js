import React, {useContext, useState} from 'react';
import {Alert, ScrollView, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {Avatar, Divider, Text} from 'react-native-elements';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'expo-status-bar';
import ListButtonElement from '../components/ListButtonElement';
import NiceDivider from '../components/NiceDivider';
import GlobalStyles from '../styles/GlobalStyles';
import TextBoxStyles from '../styles/TextBoxStyles';
import {colors} from '../utils/variables';
import {useEffect} from 'react';
import LoadingModal from '../components/LoadingModal';
import List from '../components/List';

const Profile = ({navigation}) => {
  const {user, setIsLoggedIn} = useContext(MainContext);
  const [loading, setLoading] = useState(false);

  const doLogout = async () => {
    setLoading(true);
    try {
      setIsLoggedIn(false);
      await AsyncStorage.clear();
      navigation.navigate('Login');
    } catch (e) {
      Alert.alert('Error', 'While logging out');
    } finally {
      setLoading(false);
    }
  };

  const doUpdate = () => {
    navigation.navigate('Update Profile');
  };

  useEffect(() => {
    console.log('user', user);
  }, []);

  return (
    <>
      <LoadingModal visible={loading} />
      <ScrollView contentContainerStyle={GlobalStyles.scrollView}>
        <Avatar
          title={user.full_name[0]}
          source={{uri: user.avatar}}
          containerStyle={GlobalStyles.profileImage}
          rounded
        />
        <Divider style={{height: 10}} />

        <Text h4 style={styles.name}>
          {user.full_name}
        </Text>
        <Divider style={{height: 25}} />

        <View style={[TextBoxStyles.box, TextBoxStyles.paddingBox]}>
          <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>
            Username
          </Text>
          <Text style={TextBoxStyles.text}>{user.username}</Text>
          <NiceDivider />
          <Text style={[TextBoxStyles.text, TextBoxStyles.title]}>Email</Text>
          <Text style={TextBoxStyles.text}>{user.email}</Text>
        </View>

        <NiceDivider color="#FFF0" lineHeight={0} />

        <View style={TextBoxStyles.box}>
          <ListButtonElement text="Update Profile" onPress={doUpdate} />
          <NiceDivider
            space={0}
            style={{
              marginStart: 20,
              marginEnd: 20,
            }}
          />
          <ListButtonElement text="Logout" onPress={doLogout} />
        </View>
        <NiceDivider color="#FFF0" lineHeight={0} />
        <View style={TextBoxStyles.box}>
          <Text h1 style={{textAlign: 'center', color: 'white'}}>
            Your posts
          </Text>
          <List navigation={navigation} myFilesOnly={true} />
        </View>
        <StatusBar style="light" backgroundColor={colors.statusbar} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    alignItems: 'center',
  },
  imgContainer: {
    width: 200,
    height: 200,
  },
  name: {
    textAlign: 'center',
  },
  box: {
    width: '100%',
    backgroundColor: '#75B09C',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  info: {
    padding: 20,
  },
  infoText: {
    color: 'white',
    fontSize: 15,
  },
  infoTitle: {
    textTransform: 'uppercase',
  },
  infoDesc: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    backgroundColor: '#FFF0',
    padding: 20,
  },
  buttonText: {
    color: 'white',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
  },
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
