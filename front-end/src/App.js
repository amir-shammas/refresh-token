import React, { useCallback, useEffect, useState, useContext} from "react";
import { useRoutes } from "react-router-dom";
import AuthContext from "./context/authContext";
import routes from "./routes";

import "./App.css";

export default function App() {
  const authContext = useContext(AuthContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(false);
  const [refreshToken, setRefreshToken] = useState("");
  const [userInfos, setUserInfos] = useState({});

  const router = useRoutes(routes);

  // const login = useCallback((userInfos, token) => {
  //   setToken(token);
  //   setIsLoggedIn(true);
  //   setUserInfos(userInfos);
  //   localStorage.setItem("user", JSON.stringify({ token }));
  // }, []);

  // const login = (userInfos, token, rememberMe) => {
  const login = (userInfos, token, refreshToken, rememberMe) => {
    setToken(token);
    setRefreshToken(refreshToken);
    setCookieForRefreshToken(refreshToken);
    setIsLoggedIn(true);
    setUserInfos(userInfos);

    // localStorage.setItem("user", JSON.stringify({ token }));

    if(rememberMe){
      localStorage.setItem("user", JSON.stringify({ token }));
    }else{
      sessionStorage.setItem("user", JSON.stringify({ token }));
    }
  };

  const logout = useCallback(() => {
    setToken(null);
    setRefreshToken(null);
    setIsLoggedIn(false);
    setUserInfos({});
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    clearCookieForRefreshToken();
  });


  const setCookieForRefreshToken = async (refreshToken) => {
    try{
      const userRefreshToken = {
        refreshToken: refreshToken,
      }
      await fetch("http://localhost:4000/auth/set-cookie-for-refresh-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials for cookies
        body: JSON.stringify(userRefreshToken),
      })
    }catch(error){
      console.log(error);
    }
  }


  const getCookieForRefreshToken = async () => {
    try{

      const response = await fetch("http://localhost:4000/auth/get-cookie-for-refresh-token", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials for cookies
      })

      const data = await response.json();
      console.log(data.refreshToken);
      return data.refreshToken;

    }catch(error){
      console.log(error);
    }
  }


  const clearCookieForRefreshToken = async () => {
    try{
      await fetch("http://localhost:4000/auth/clear-cookie-for-refresh-token", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include", // Include credentials for cookies
      })
    }catch(error){
      console.log(error);
    }
  }


  // const refreshToken = async () => {
  //   try{

  //     await fetch("http://localhost:4000/auth/refresh-token", {
  //       method: "GET",
  //       headers: {
  //           "Content-Type": "application/json",
  //       },
  //       credentials: "include", // Include credentials for cookies
  //     })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then(async (result) => {
  //       console.log(result);
  //       setCookieForRefreshToken(result.refreshToken);
  //       // localStorage.setItem("user", JSON.stringify(result.accessToken));
  //       setToken(result.accessToken);
  //       await fetch(`http://localhost:4000/auth/me`, {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       })
  //       .then((res) => {
  //         return res.json();
  //       })
  //       .then((userData) => {
  //         setIsLoggedIn(true);
  //         setUserInfos(userData);
  //       })
  //     })

  //   }catch(error){
  //     console.log(error);
  //   }
  // }


  // useEffect(() => {
  //   refreshToken();
  // }, [])


  useEffect(() => {
    const storageData = JSON.parse(localStorage.getItem("user")) || JSON.parse(sessionStorage.getItem("user"));
    if (storageData) {
      // If there's a token in local storage, set it to state
      setToken(storageData.token);
    }
  }, []); // Run only once on mount


  useEffect(() => {
    const currentRefreshToken = getCookieForRefreshToken();
    if(currentRefreshToken){
      setRefreshToken(currentRefreshToken);
    }
  }, [])


  useEffect(() => {
    if (token) {
      fetch(`http://localhost:4000/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Network response was not ok');
          }
          return res.json();
        })
        .then((userData) => {
          setIsLoggedIn(true);
          setUserInfos(userData);
        })
        .catch(() => {
          setIsLoggedIn(false);
          setUserInfos({});
          setToken(null);
          localStorage.removeItem("user"); // Clear user data on error
          sessionStorage.removeItem("user"); // Clear user data on error
        });
    }
  }, [token]); // Run this effect when the token changes


  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        refreshToken,
        userInfos,
        login,
        logout,
      }}
    >
      {router}
    </AuthContext.Provider>
  );
}
