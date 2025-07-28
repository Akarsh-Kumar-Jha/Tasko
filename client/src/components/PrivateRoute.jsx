import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm font-medium">Checking your access...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated === false) return <Navigate to="/login" />
  return children
}

export default PrivateRoute
