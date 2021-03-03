import {StyleSheet, Platform, StatusBar} from 'react-native';
export default StyleSheet.create({
  appBackground: {
    backgroundColor: 'white',
  },
  droidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollView: {
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 5,
    justifyContent: 'flex-end',
  },
  loginTitle: {
    fontSize: 30,
    textAlign: 'center',
  },
});
