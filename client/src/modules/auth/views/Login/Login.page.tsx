import React, { useCallback, useState } from 'react';
import Button from '../../../../components/atoms/Button';
import Input from '../../../../components/atoms/Input';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../../components/molecules/Loader';
import useLogin from '../../mutations/Login.mutation';
import { removeTokens, setTokens } from '../../../../configs/localStorage';
import { useQueryClient } from 'react-query';
import { useGetCurrentUserQueryKey } from '../../queries';

const Login: React.FC = (() => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  const login = useLogin({
    onSuccess: (res) => {
      setIsLoading(false);
      setTokens(res);
      queryClient.invalidateQueries(useGetCurrentUserQueryKey);
    },
    onError: (err) => {
      setIsLoading(false);
      setErrMessage(`Login Failed. ${err.message}`);
      removeTokens();
    },
  });

  const onLogin = useCallback(() => {
    setIsLoading(true);
    login.mutate({email, password})
  }, [email, password, login]);

  return (
    <div className='min-w-screen min-h-screen flex justify-center items-center'>
      <div className='flex flex-col border border-neutral-200 rounded p-5 gap-5 shadow-xl shadow-neutral-900'>
        <h1 className='text-3xl'>Login</h1>
        <div className='flex flex-col min-w-[300px]'>
          <span>Email</span>
          <Input placeholder='Your email' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}/>
        </div>
        <div className='flex flex-col'>
          <span>Password</span>
          <Input type='password' onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
        </div>
        <Button type='submit' disabled={!(email && password) || isLoading} onClick={onLogin} >{isLoading ? <Loader /> : 'Login'}</Button>
        {
          errMessage !== '' && <span className='self-center text-sm text-red-400'>{errMessage}</span>
        }
        <div className='flex flex-row justify-between'>
          <Button buttonType='anchor' onClick={() => navigate('/register')}>Register</Button>
          <Button buttonType='anchor' onClick={() => navigate('/')}>Home</Button>
        </div>
      </div>
    </div>
  )
});

export default Login;