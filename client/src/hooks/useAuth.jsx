import React, { useEffect, useState } from 'react'
import axiosInstance from '../axios/axiosInstance'

function useAuth() {

const [isAuthenticated,setIsAuthenticated] = useState(null);
const [user,setUser] = useState(false);

const fetchUser = async() => {
    try {
        const response = await axiosInstance.get('/user/get-user');
        setIsAuthenticated(true);
        setUser(response?.data?.user);
    } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
    }
}

useEffect(() => {
fetchUser();
},[]);

  return {isAuthenticated,user,fetchUser};
}

export default useAuth