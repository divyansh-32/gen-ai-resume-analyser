import React from 'react'
import useAuthStore from '../../../store/authStore';

function ProtectedRoute() {
  const {isAuthenticated, loading} = useAuthStore();
  if(loading) {
    return <div>Loading...</div>
  }
  if (!isAuthenticated) {
    return (
        <Navigate to={'/login'}></Navigate>
  )
  }
}

export default ProtectedRoute