import React from 'react';
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import { AuthProvider } from '../hooks/useAuth';
import { HouseThemeProvider } from '../hooks/useHouseTheme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <HouseThemeProvider>
        <Component {...pageProps} />
      </HouseThemeProvider>
    </AuthProvider>
  );
}

export default MyApp; 