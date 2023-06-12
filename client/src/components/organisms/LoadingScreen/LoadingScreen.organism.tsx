import React from 'react';
import Loader from '../../molecules/Loader';
import './LoadingScreen.scss';

const LoadingScreen: React.FC = () => {
  return (
    <div className='loading-screen-organism'>
      <div className='wrapper'>
        <Loader />
      </div>
    </div>
  );
};

export default LoadingScreen;
