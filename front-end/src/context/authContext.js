import { createContext } from "react";

const AuthContext = createContext({
  isLoggedIn: false,
  token: null,
  refreshToken: null,
  userInfos: null,
  login: () => {},
  logout: () => {},
});

export default AuthContext;
