import React from 'react';
import {Modal, ActivityIndicator, StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {colors} from '../utils/variables';

const LoadingModal = ({visible = false}) => {
  return (
    <Modal visible={visible} transparent={true}>
      <View style={styles.centered}>
        <ActivityIndicator size={100} color={colors.accent} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0004',
  },
});

LoadingModal.propTypes = {
  visible: PropTypes.bool,
};

export default LoadingModal;
