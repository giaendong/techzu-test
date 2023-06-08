import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Router from './router/Router';
import AuthProvider from './modules/auth/Auth.context';

const App: React.FC = () => {
  const [client] = useState(new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
