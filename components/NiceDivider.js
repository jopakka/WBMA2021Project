import React from 'react';
import {Divider} from 'react-native-elements';
import PropTypes from 'prop-types';

const NiceDivider = ({
  lineHeight = 1,
  space = 10,
  color = '#FFF',
  style = {},
}) => {
  return (
    <>
      <Divider style={{height: space, backgroundColor: '#FFF0'}} />
      <Divider style={[{height: lineHeight, backgroundColor: color}, style]} />
      <Divider style={{height: space, backgroundColor: '#FFF0'}} />
    </>
  );
};

NiceDivider.propTypes = {
  lineHeight: PropTypes.number,
  space: PropTypes.number,
  color: PropTypes.string,
  style: PropTypes.object,
};

export default NiceDivider;
