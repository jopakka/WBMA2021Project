import React from 'react';
import PropTypes from 'prop-types';
import {TouchableHighlight} from 'react-native';
import {ListItem} from 'react-native-elements';
import {StyleSheet} from 'react-native';

const ListButtonElement = ({
  text,
  color = 'white',
  chevronSize = 24,
  containerStyle = {},
  onPress = () => {},
  disabled = false,
}) => {
  return (
    <TouchableHighlight
      onPress={onPress}
      disabled={disabled}
      underlayColor="#A0CA92"
      style={{backgroundColor: disabled ? '#AAA' : '#FFF0'}}
    >
      <ListItem containerStyle={[styles.buttonContainer, containerStyle]}>
        <ListItem.Content>
          <ListItem.Title
            style={{
              color: disabled ? '#DDD' : color,
              textTransform: 'uppercase',
            }}
          >
            {text}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron
          color={disabled ? '#DDD' : color}
          size={chevronSize}
        />
      </ListItem>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: '#FFF0',
    padding: 20,
  },
});

ListButtonElement.propTypes = {
  text: PropTypes.string,
  color: PropTypes.string,
  chevronSize: PropTypes.number,
  containerStyle: PropTypes.object,
  onPress: PropTypes.func,
  disabled: PropTypes.bool,
};

export default ListButtonElement;
