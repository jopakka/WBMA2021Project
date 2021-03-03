import React from 'react';
import {FlatList} from 'react-native';
import {useLoadMedia} from '../hooks/ApiHooks';
import ListItem from './ListItem';
import PropTypes from 'prop-types';

const List = ({navigation}) => {
  const mediaArray = useLoadMedia();

  // updating profile failes to reverse the list
  return (
    <FlatList
      data={mediaArray.reverse()}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <ListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};
List.propTypes = {
  navigation: PropTypes.object,
};
export default List;
