import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate } from 'react-router-dom';

function PrivateRoute({children}) {
    const {isAuthenticated} = useAuth();

    if(isAuthenticated === null) return <div>Loading...</div>
    if(isAuthenticated === false) return <Navigate to='/login' />
    return children;
}

export default PrivateRoute