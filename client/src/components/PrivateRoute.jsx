import React from 'react'
import useAuth from '../hooks/useAuth'
import { Navigate } from 'react-router-dom'

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth()

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-[#121212] transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium animate-pulse">
            Checking your access...
          </p>
        </div>
      </div>
    )
  }

  if (isAuthenticated === false) return <Navigate to="/login" />
  return children
}

export default PrivateRoute
