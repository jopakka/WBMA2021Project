import React, {useState, useContext} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {Avatar, Divider, Text} from 'react-native-elements';
import {MainContext} from '../contexts/MainContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'expo-status-bar';
import ListButtonElement from '../components/ListButtonElement';
import NiceDivider from '../components/NiceDivider';

const Profile = ({navigation}) => {
  const {user, setIsLoggedIn} = useContext(MainContext);
  const [loading, setLoading] = useState(false);

  const doLogout = async () => {
    setLoading(true);
    setIsLoggedIn(false);
    await AsyncStorage.clear();
    navigation.navigate('Login');
    setLoading(false);
  };

  const doUpdate = () => {
    navigation.navigate('Update Profile');
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Avatar
        title={user.full_name[0]}
        source={{uri: user.avatar}}
        containerStyle={styles.img}
        avatarStyle={{borderRadius: 10}}
      />
      <Divider style={{height: 10}} />
      <Text h4 style={styles.name}>
        {user.full_name}
      </Text>
      <Divider style={{height: 25}} />
      <View style={[styles.box, styles.info]}>
        <Text style={[styles.infoText, styles.infoTitle]}>Username</Text>
        <Text style={[styles.infoText, styles.infoDesc]}>{user.username}</Text>
        <NiceDivider />
        <Text style={[styles.infoText, styles.infoTitle]}>Email</Text>
        <Text style={[styles.infoText, styles.infoDesc]}>{user.email}</Text>
      </View>

      <Divider style={{height: 20, backgroundColor: '#FFF0'}} />

      <View style={styles.box}>
        <ListButtonElement text="Update Profile" onPress={doUpdate} />
        <Divider
          style={{
            height: 1,
            backgroundColor: '#FFF',
            marginStart: 20,
            marginEnd: 20,
          }}
        />
        <ListButtonElement text="Logout" onPress={doLogout} />
      </View>

      <StatusBar style="light" backgroundColor="#998650" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    padding: 20,
    alignItems: 'center',
  },
  img: {
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
});

Profile.propTypes = {
  navigation: PropTypes.object,
};

export default Profile;
