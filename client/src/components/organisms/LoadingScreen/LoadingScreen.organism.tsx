import React from 'react';
import Loader from '../../molecules/Loader';

const LoadingScreen: React.FC = () => {
  return (
    <div className='flex items-center justify-center w-screen h-screen bg-neutral-800'>
      <div className='flex justify-center items-center rounded-xl bg-opacity-50 w-24 h-24'>
        <Loader />
      </div>
    </div>
  );
};

export default LoadingScreen;
