import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const useAxios = () => {
  const { axiosInstance } = useContext(AuthContext);
  return axiosInstance;
};

export default useAxios;