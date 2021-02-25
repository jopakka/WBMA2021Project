import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Card, Text} from 'react-native-elements';
import {uploadsUrl} from '../utils/variables';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUser} from '../hooks/ApiHooks';
import {parse} from '../utils/helpers';

const SingleJob = ({route}) => {
  const {file} = route.params;
  const {getUser} = useUser();
  const [owner, setOwner] = useState({});
  console.log(file);
  console.log(owner);
  const fetchOwner = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      let userData = await getUser(file.user_id, userToken);
      userData = parse(userData, 'full_name');
      setOwner(userData);
    } catch (error) {
      console.error('fetchOwner error', error.message);
    }
  };

  useEffect(() => {
    fetchOwner();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Card>
        <Card.Title h3> {file.title}</Card.Title>
        <Card.Divider />
        <View style={styles.jobInfo}>
          <Card.Image
            source={{uri: uploadsUrl + file.filename}}
            style={styles.img}
            resizeMode="contain"
          />
          <View>
            <Text h3>Job poster</Text>
            <Text h4>{owner.full_name}</Text>
          </View>
        </View>
        <Text style={styles.userInfo}>{file.description} </Text>
        <Text style={styles.userInfo}>Pay here</Text>
        <Button title={'Contact employer'}></Button>
      </Card>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  jobInfo: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: 'center',
  },
  userDetails: {
    flexGrow: 1,
  },
  img: {
    height: 100,
    width: 100,
    aspectRatio: 1,
    borderRadius: 40,
    marginEnd: 10,
  },
  desc: {
    fontWeight: 'bold',
  },
  userInfo: {
    fontSize: 20,
    marginBottom: 10,
  },
  contact: {
    height: 30,
  },
});

SingleJob.propTypes = {
  route: PropTypes.object,
};

export default SingleJob;
