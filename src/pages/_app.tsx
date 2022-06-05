import NiceModal from '@ebay/nice-modal-react';
import App, { AppInitialProps } from 'next/app';

import '@/styles/globals.css';
import 'antd/dist/antd.css';
import 'react-phone-number-input/style.css';

import Layout from '@/components/Layout';

import { wrapper } from '@/store';
class MyApp extends App<AppInitialProps> {
  public static getInitialProps = wrapper.getInitialAppProps(
    () => async (context) => {
      // store.dispatch(getUsersAsync());
      // store.dispatch(getPostsAsync());
      return {
        pageProps: {
          // https://nextjs.org/docs/advanced-features/custom-app#caveats
          ...(await App.getInitialProps(context)).pageProps,
          // Some custom thing for all pages
        },
      };
    }
  );
  public render() {
    const { Component, pageProps } = this.props;
    return (
      <NiceModal.Provider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NiceModal.Provider>
    );
  }
}

export default wrapper.withRedux(MyApp);
