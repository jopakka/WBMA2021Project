import React from 'react';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ListItem = ({singleMedia, navigation}) => {
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
          <RNEListItem.Subtitle>{singleMedia.description}</RNEListItem.Subtitle>
        </RNEListItem.Content>
        <RNEListItem.Chevron />
      </RNEListItem>
    </TouchableOpacity>
  );
};

ListItem.propTypes = {
  singleMedia: PropTypes.object,
  navigation: PropTypes.object,
};

export default ListItem;
