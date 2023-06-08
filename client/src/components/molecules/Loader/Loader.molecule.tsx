import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className='flex justify-center py-2'>
      <div className='w-2 h-2 rounded-full bg-teal-300 mx-2 animate-bounce delay-100' />
      <div className='w-2 h-2 rounded-full bg-teal-300 mx-2 animate-bounce delay-300' />
      <div className='w-2 h-2 rounded-full bg-teal-300 mx-2 animate-bounce delay-500' />
      <div className='w-2 h-2 rounded-full bg-teal-300 mx-2 animate-bounce delay-700' />
      <div className='w-2 h-2 rounded-full bg-teal-300 mx-2 animate-bounce delay-1000' />
    </div>  
  );
};

export default Loading;