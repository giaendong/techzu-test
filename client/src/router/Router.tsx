import React, { Suspense, useContext } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoadingScreen from '../components/organisms/LoadingScreen/LoadingScreen.organism';
import Home from '../modules/main/views/Home/Home.page';
import Login from '../modules/auth/views/Login/Login.page';
import Register from '../modules/auth/views/Register/Register.page';
import { AuthContext } from '../modules/auth/Auth.context';

const Router: React.FC = () => {
  const { initializing, isAuthenticated } = useContext(AuthContext);

  if (initializing) return (<LoadingScreen />)
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to='/login' /> } />
          <Route path="/login" element={isAuthenticated ? <Navigate to='/' /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to='/' /> : <Register />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default Router;
