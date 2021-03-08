import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import LocationListItem from './LocationListItem';
import PropTypes from 'prop-types';

const LocationList = ({navigation, content}) => {
  // console.log('this is contett', content);

  const [locations, setlocations] = useState(content);

  useEffect(() => {
    setlocations(content);
  }, [content]);
  // console.log('this is state', locations);

  return (
    <FlatList
      style={{flex: 1, position: 'absolute', left: 0, top: 0}}
      data={locations}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <LocationListItem
          navigation={navigation}
          singleLocation={item}
          callBack={(data) => {
            setlocations(data);
          }}
        />
      )}
    />
  );
};
LocationList.propTypes = {
  navigation: PropTypes.object,
  content: PropTypes.array,
};
export default LocationList;
