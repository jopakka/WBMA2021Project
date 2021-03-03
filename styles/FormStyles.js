import {StyleSheet} from 'react-native';
import {colors} from '../utils/variables';
export default StyleSheet.create({
  formInput: {
    color: 'white',
  },
  formInputContainer: {
    borderColor: colors.accent,
    borderBottomWidth: 3,
  },
  checkText: {
    textTransform: 'uppercase',
    color: 'white',
  },
  check: {
    backgroundColor: '#FFF0',
    borderWidth: 0,
    padding: 0,
    paddingHorizontal: 0,
  },
  error: {
    fontSize: 14,
    color: 'white',
  },
});
