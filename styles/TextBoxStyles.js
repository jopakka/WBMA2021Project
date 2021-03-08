import {StyleSheet} from 'react-native';
export default StyleSheet.create({
  box: {
    width: '100%',
    backgroundColor: '#75B09C',
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  paddingBox: {
    padding: 20,
  },
  text: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
  title: {
    textTransform: 'uppercase',
    fontWeight: 'normal',
  },
});
