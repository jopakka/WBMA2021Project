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
    paddingVertical: 10,
    alignItems: 'center',
  },
  profileImage: {
    width: '30%',
    height: undefined,
    aspectRatio: 1,
    justifyContent: 'flex-end',
    alignSelf: 'center',
    marginRight: 20,
  },
  loginTitle: {
    fontSize: 30,
    textAlign: 'center',
  },
  appTitleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});
