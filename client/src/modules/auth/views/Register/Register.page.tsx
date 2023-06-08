import React, { useCallback, useState } from 'react';
import Button from '../../../../components/atoms/Button';
import Input from '../../../../components/atoms/Input';
import { useNavigate } from 'react-router-dom';
// import { useRegister } from '../../mutations';
import Loader from '../../../../components/molecules/Loader';
import useRegister from '../../mutations/Register.mutation';

const Register: React.FC = (() => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');
  const [isSignUpSuccess, setIsSignUpSuccess] = useState(false);

  const register = useRegister({
    onSuccess: () => {
      setIsLoading(false);
      setIsSignUpSuccess(true);
    },
    onError: (err: any) => {
      setIsLoading(false);
      setErrMessage(`Account Creation Failed. ${err.message}`);
    },
  });

  const registerAccount = useCallback( async () => {
    setIsLoading(true);
    console.log(email, password)
    register.mutate({email, password, username});
  },[email, password, username, register]);

  return (
    <div className='min-w-screen min-h-screen flex justify-center items-center'>
      <div className='flex flex-col border border-neutral-200 rounded p-5 gap-5 shadow-xl shadow-neutral-900'>
        {
          isSignUpSuccess ?
            <>
              <h1 className='text-xl text-teal-200 text-center'>Registration Successful</h1>
              <div className='max-w-[300px] text-center'>
                <div className='text-sm'>Now you can signing in to app.</div>
              </div>
              <Button buttonType='anchor' onClick={() => navigate('/login')}>Go To Login Page</Button>
            </> :
            <>
              <h1 className='text-3xl'>Register</h1> 
              <div className='flex flex-col min-w-[300px]'>
                <span>Email</span>
                <Input placeholder='Your email' onChange={e => setEmail(e.target.value)}/>
              </div>
              <div className='flex flex-col min-w-[300px]'>
                <span>Username</span>
                <Input placeholder='Your username' onChange={e => setUsername(e.target.value)}/>
              </div>
              <div className='flex flex-col'>
                <span>Password</span>
                <Input type='password' onChange={e => setPassword(e.target.value)} />
              </div>
              <div className='flex flex-col'>
                <span>Confirm Password</span>
                <Input type='password' onChange={e => setConfirmPassword(e.target.value)} />
                {
                  password !== '' && confirmPassword !== '' && confirmPassword !== password && <span className='text-sm text-red-400'>password mismatch</span>
                }
              </div>
              <Button type='submit' disabled={!(email && password && confirmPassword) || isLoading} onClick={registerAccount}>{isLoading ? <Loader /> : 'Register'}</Button>
              {
                errMessage !== '' && <span className='text-sm text-red-400'>{errMessage}</span>
              }
              <div className='flex flex-row justify-between'>
                <Button buttonType='anchor' onClick={() => navigate('/login')}>Login</Button>
                <Button buttonType='anchor' onClick={() => navigate('/')}>Home</Button>
              </div>
            </>
        }
      </div>
    </div>
  )
});

export default Register;