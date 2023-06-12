import React from 'react';
import './Loader.scss';

const Loader: React.FC = () => {
  return (
    <div className='loader-molecule'>
      <div className='dots' />
      <div className='dots' />
      <div className='dots' />
      <div className='dots' />
      <div className='dots' />
    </div>  
  );
};

export default Loader;