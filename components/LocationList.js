import React, {useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import LocationListItem from './LocationListItem';
import PropTypes from 'prop-types';

const LocationList = ({navigation, content}) => {
  console.log('this is contett', content);

  const [state, setState] = useState(content);

  useEffect(() => {
    setState(content);
  }, [content]);

  console.log('this is state', state);
  return (
    <FlatList
      style={{flex: 1, position: 'absolute', left: 0, top: 0}}
      data={state}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({item}) => (
        <LocationListItem
          navigation={navigation}
          singleLocation={item}
          setState={(data) => {
            setState(data);
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
