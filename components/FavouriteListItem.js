import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useFavourite, useMedia} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {View} from 'react-native';

const FavouriteListItem = ({singleMedia, navigation}) => {
  const [iconStatus, setIconStatus] = useState(singleMedia.favourite);

  const {postFavourite, deleteFavourite} = useFavourite();
  const {updateFile} = useMedia();

  const doFavUpdate = async (fav) => {
    const otherData = {
      description: singleMedia.description,
      payMethod: singleMedia.payMethod,
      wage: singleMedia.wage,
      place_name: singleMedia.place_name,
      coordinates: singleMedia.coordinates,
      text: singleMedia.text,
      favourite: fav,
    };

    const data = {
      description: JSON.stringify(otherData),
    };

    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('data', data);
      console.log('file_id', singleMedia.file_id);
      console.log('token', token);
      const result = await updateFile(singleMedia.file_id, data, token);
      return result;
    } catch (e) {
      console.error('doUpdate', e.message);
    }
  };

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
            if (singleMedia.favourite === 'star') {
              try {
                const favourite = await deleteFavourite(singleMedia.file_id);
                setIconStatus('star-outline');
                await doFavUpdate('star-outline');
                console.log('favourite deleted', favourite);
              } catch (error) {
                console.error(error.message);
              }
            } else {
              try {
                const favourite = await postFavourite({
                  file_id: singleMedia.file_id,
                });
                setIconStatus('star');
                await doFavUpdate('star');
                console.log('favourite posted', favourite);
              } catch (error) {
                console.error(error.message);
              }
            }
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
