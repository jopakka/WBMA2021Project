import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useUser} from '../hooks/ApiHooks';
import {parse} from '../utils/helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MainContext} from '../contexts/MainContext';

const ListItem = ({singleMedia, navigation}) => {
  const [owner, setOwner] = useState({});
  const {getUser} = useUser();
  const {update} = useContext(MainContext);

  const fetchUser = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      let userData = await getUser(singleMedia.user_id, userToken);
      userData = parse(userData, 'full_name');
      console.log('username', userData);
      setOwner(userData);
    } catch (error) {
      console.error('fetchOwner error in ListItem', error.message);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [update]);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Job Offer', {file: singleMedia});
      }}
    >
      <RNEListItem bottomDivider>
        <Avatar
          size="large"
          rounded
          source={{uri: uploadsUrl + singleMedia.thumbnails.w160}}
        />
        <RNEListItem.Content>
          <RNEListItem.Title h4>{singleMedia.title}</RNEListItem.Title>
          <RNEListItem.Subtitle>{owner.full_name}</RNEListItem.Subtitle>
          <RNEListItem.Subtitle>{singleMedia.place_name}</RNEListItem.Subtitle>
        </RNEListItem.Content>

        <Ionicons name={'star-outline'} size={'large'} />
      </RNEListItem>
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
