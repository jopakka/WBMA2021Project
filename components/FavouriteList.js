import React, {useContext} from 'react';
import {FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {useLoadFavourites} from '../hooks/ApiHooks';
import FavouriteListItem from './FavouriteListItem';
import {MainContext} from '../contexts/MainContext';

const FavouriteList = ({navigation}) => {
  const favouriteArray = useLoadFavourites();
  const {update, setUpdate} = useContext(MainContext);
  const {refresh, setRefresh} = useContext(MainContext);

  return (
    <FlatList
      onRefresh={() => {
        setRefresh(true);
        setUpdate(!update);
      }}
      refreshing={refresh}
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
