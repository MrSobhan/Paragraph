import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const baseUrl = 'https://virgool.onrender.com/v1';
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };

  const getLocalStorage = (key) => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };

  const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    const token = getLocalStorage('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const LoginUser = async (credentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const { token } = response.data;
      
      setLocalStorage('token', token);
      await getMe();
      setIsLogin(true);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'خطا در ورود' 
      };
    }
  };

  const RegisterUser = async (userData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      const { token } = response.data;
      
      setLocalStorage('token', token);
      await getMe();
      setIsLogin(true);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'خطا در ثبت‌نام' 
      };
    }
  };

  const getMe = async () => {
    try {
      const response = await axiosInstance.get('/auth/me');
      setUser(response.data);
      setIsLogin(true);
      return response.data;
    } catch (error) {
      return null;
    }
  };

  const LogOutUser = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsLogin(false);
  };

  useEffect(() => {
    const token = getLocalStorage('token');
    if (token) {
      setIsLoading(true);
      getMe().then((data) => {
        if (!data) {
          LogOutUser();
        }
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        baseUrl,
        user,
        setLocalStorage,
        getLocalStorage,
        isLogin,
        isLoading,
        LoginUser,
        RegisterUser,
        LogOutUser,
        getMe,
        axiosInstance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth باید داخل AuthProvider استفاده شود');
  }
  return context;
};

export default AuthContext;