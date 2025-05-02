import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../hooks/useAuth';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/reactQuery';
import UserDataRefresher from '../components/UserDataRefresher';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <UserDataRefresher />
        <Component {...pageProps} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default MyApp; 