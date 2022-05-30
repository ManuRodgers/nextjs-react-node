import React, { FC, memo, PropsWithChildren } from 'react';

import Footer from '@/components/Footer';
import Header from '@/components/Header';

type LayoutProps = { name?: string };

const Layout: FC<PropsWithChildren<LayoutProps>> = ({
  children,
}): JSX.Element => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};
export default memo(Layout);
