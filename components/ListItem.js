import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {TouchableOpacity} from 'react-native';
import {useFavourite} from '../hooks/ApiHooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {View} from 'react-native';

const ListItem = ({singleMedia, navigation}) => {
  const [iconStatus, setIconStatus] = useState(singleMedia.favourite);

  const {postFavourite, deleteFavourite} = useFavourite();

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
            if (singleMedia.favourite === true) {
              try {
                const favourite = await deleteFavourite(singleMedia.file_id);
                singleMedia.favourite = false;
                setIconStatus(false);
                console.log('favourite deleted', favourite);
              } catch (error) {
                console.error(error.message);
              }
            } else {
              try {
                const favourite = await postFavourite({
                  file_id: singleMedia.file_id,
                });
                singleMedia.favourite = true;
                setIconStatus(true);
                console.log('favourite posted', favourite);
              } catch (error) {
                console.error(error.message);
              }
            }
          }}
        >
          <Ionicons name={iconStatus ? 'star' : 'star-outline'} size={50} />
        </TouchableOpacity>
      </RNEListItem>
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
