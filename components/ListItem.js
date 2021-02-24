import React from 'react';
import {StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';
import {Avatar, ListItem as RNEListItem} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ListItem = ({singleMedia}) => {
  return (
<<<<<<< HEAD
    <TouchableOpacity>
      <RNEListItem bottomDivider>
        <Avatar
          size="large"
          rounded
          source={{uri: uploadsUrl + singleMedia.thumbnails.w160}}
=======
    <TouchableOpacity style={styles.row}>
      <View style={styles.imagebox}>
        <Image
          style={styles.image}
          source={{
            uri: singleMedia.thumbnails
              ? uploadsUrl + singleMedia.thumbnails.w160
              : 'http:placekitten.com/160',
          }}
>>>>>>> f64fea29ce78b06d3f01f2eed39af6c0a39bc9c6
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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    padding: 15,
    marginBottom: 5,
    backgroundColor: '#eee',
    borderRadius: 16,
  },
  imagebox: {
    flex: 1,
  },
  textbox: {
    flex: 2,
    padding: 10,
  },
  image: {
    flex: 1,
    borderRadius: 6,
  },
  listTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 15,
  },
});

ListItem.propTypes = {
  singleMedia: PropTypes.object,
};

export default ListItem;
