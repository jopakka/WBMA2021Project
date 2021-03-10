import React, {useState} from 'react';
import PropTypes from 'prop-types';

const MainContext = React.createContext({});

const MainProvider = ({children}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [update, setUpdate] = useState(false);
  const [updateComments, setUpdateComments] = useState(false);
  const [locationArray, setLocationArray] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState({});
  const [firstLoad, setFirstLoad] = useState(true);
  const [refresh, setRefresh] = useState(false);

  return (
    <MainContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        update,
        setUpdate,
        firstLoad,
        setFirstLoad,
        updateComments,
        setUpdateComments,
        locationArray,
        setLocationArray,
        selectedLocation,
        setSelectedLocation,
        refresh,
        setRefresh,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

MainProvider.propTypes = {
  children: PropTypes.node,
};

export {MainContext, MainProvider};
