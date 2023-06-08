import React from 'react';
import { removeTokens } from '../../../../configs/localStorage';
import Navbar from '../../../../components/organisms/Navbar/Navbar.organism';

const Home: React.FC = (() => {

  return (
    <div className='w-screen pt-20'>
      <Navbar />
      <h1>Home</h1>
      <button onClick={() => removeTokens()}>Logout</button>
    </div>
  )
});

export default Home;