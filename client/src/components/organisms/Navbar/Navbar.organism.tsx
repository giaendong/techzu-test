import React, { useCallback, useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../atoms/Button';
import { removeTokens } from '../../../configs/localStorage';
import { AuthContext } from '../../../modules/auth/Auth.context';
import { useQueryClient } from 'react-query';
import { useGetCurrentUserQueryKey } from '../../../modules/auth/queries';

const Navbar: React.FC = () => {
  const queryClient = useQueryClient();
  const { currentUserData, isAuthenticated } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onLogout = useCallback(() => {
    removeTokens();
    queryClient.invalidateQueries(useGetCurrentUserQueryKey);
  }, [queryClient]);

  return (
    <>
      <div className='flex flex-row justify-between px-5 py-3 shadow-md shadow-neutral-900 fixed top-0 w-screen bg-neutral-800 items-center'>
        <Link to={'/'} className='text-orange-400 no-underline'>Techzu Test</Link>
        <div className='flex flex-row items-center gap-2'>
          {
            isAuthenticated ?
              <div
                role='button'
                className='w-4 h-4 flex justify-center items-center rounded-full bg-orange-500 text-white uppercase p-3'
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >{currentUserData?.username.charAt(0)}</div> :
              <Link to={'/login'} className='text-teal-400 no-underline'>Login / Register</Link>
          }
        </div>
      </div>
      <div className={`z-40 flex flex-col justify-between w-full lg:w-1/4 right-0 top-0 h-screen fixed overflow-hidden shadow-lg shadow-neutral-900 p-5 bg-neutral-800 gap-5 ${
        isMenuOpen ? 'block' : 'hidden'
      }`}>
        <div className='flex flex-col'>
          <div className='self-end'><span role='button' onClick={() => setIsMenuOpen(!isMenuOpen)}>&#10005;</span></div>
          <span className='text-xl text-neutral-200'>{currentUserData?.username}</span>
          <span className='text-sm text-neutral-200'>{currentUserData?.email}</span>
        </div>
        <div className='border-t border-neutral-500 py-5'>
          <Button buttonType='anchor' onClick={onLogout} className='no-underline text-neutral-500 self-start'>Logout</Button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
