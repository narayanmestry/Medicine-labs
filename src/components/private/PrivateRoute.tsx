import React from 'react'
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../shared/helper';

const PrivateRoute = () => {
  const auth = isAuthenticated();
  
  if(auth) return <Outlet/> ;

  return <Navigate to='/'/>
}

export default PrivateRoute