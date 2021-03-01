import React from 'react';
import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {useLoadFavourites} from '../hooks/ApiHooks';
import FavouriteListItem from './FavouriteListItem';

const FavouriteList = ({navigation}) => {
  const favouriteArray = useLoadFavourites();

  return (
    <FlatList
      data={favouriteArray}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <FavouriteListItem navigation={navigation} singleMedia={item} />
      )}
    />
  );
};
FavouriteList.propTypes = {
  navigation: PropTypes.object,
};
export default FavouriteList;
