import { createContext, useContext } from 'react';

const AuthContext = createContext({
    userProfile: null,
    setUserProfile: () => {},
    initializeAccess: () => {},
    resetAccess: () => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export default AuthContext;