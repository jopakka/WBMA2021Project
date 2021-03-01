import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useFavourite} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {View} from 'react-native';

const FavouriteListItem = ({singleMedia, navigation}) => {
  const [iconStatus, setIconStatus] = useState('star-outline');

  const {postFavourite} = useFavourite();

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
          <RNEListItem.Subtitle>
            {singleMedia.userinfo.full_name}
          </RNEListItem.Subtitle>
          <View style={{flexDirection: 'row'}}>
            <RNEListItem.Subtitle style={{flex: 1}}>
              {singleMedia.text}
            </RNEListItem.Subtitle>
            <RNEListItem.Subtitle style={{flex: 1}}>
              {moment(singleMedia.time_added).format('MMM D GGGG')}
            </RNEListItem.Subtitle>
          </View>
        </RNEListItem.Content>

        <TouchableOpacity
          onPress={async () => {
            const userToken = await AsyncStorage.getItem('userToken');
            const favourite = await postFavourite(
              {file_id: singleMedia.file_id},
              userToken
            );
            console.log('favourite posted', favourite);
            setIconStatus('star');
          }}
        >
          <Ionicons name={iconStatus} size={50} />
        </TouchableOpacity>
      </RNEListItem>
    </TouchableOpacity>
  );
};

FavouriteListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default FavouriteListItem;
