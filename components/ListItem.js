import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {uploadsUrl} from '../utils/variables';

const ListItem = ({singleMedia}) => {
  return (
    <TouchableOpacity style={styles.row}>
      <View style={styles.imagebox}>
        <Image
          style={styles.image}
          source={{
            uri: singleMedia.thumbnails
              ? uploadsUrl + singleMedia.thumbnails.w160
              : 'http:placekitten.com/160',
          }}
        />
      </View>
      <View style={styles.textbox}>
        <Text style={styles.listTitle}>{singleMedia.title}</Text>
        <Text>{singleMedia.description}</Text>
      </View>
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
