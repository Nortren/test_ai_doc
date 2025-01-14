import React from 'react';
import { AppProps } from 'next/app';
import '../styles/globals.scss';

import { store } from '../store/store';
import { Provider } from 'react-redux';
import dynamic from 'next/dynamic';
const MainLayout = dynamic(
  () => import('../connectors/MainLayout/MainLayout'),
  {
    ssr: false, // Отключает серверный рендеринг
  },
);
const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Provider store={store}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </Provider>
    </>
  );
};

export default App;
