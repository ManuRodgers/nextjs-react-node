import NiceModal from '@ebay/nice-modal-react';
import styled from '@emotion/styled';
import { Button } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FC, memo } from 'react';

import LoginModal from '@/modals/LoginModal';

const navs = [
  { label: 'Home', path: '/' },
  { label: 'Tab', path: '/tab' },
  { label: 'Post', path: '/post' },
];

const Header: FC = (): JSX.Element => {
  const { pathname } = useRouter();
  return (
    <HeaderContainer>
      <section className='logo'>BLOG-C</section>
      <nav>
        {navs?.map((nav, i) => (
          <Link key={i + nav.label} href={nav.path}>
            <AnchorItem active={nav.path === pathname}>{nav.label}</AnchorItem>
          </Link>
        ))}
      </nav>
      <section className='operation'>
        <Button
          onClick={() => {
            console.log('click');
          }}
        >
          Post Article
        </Button>
        <Button
          type='primary'
          onClick={() => NiceModal.show(LoginModal, { username: 'test' })}
        >
          Login
        </Button>
      </section>
    </HeaderContainer>
  );
};
export default memo(Header);

const HeaderContainer = styled.header`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 60px;
  background-color: #333;
  border-bottom: 1px solid #f1f1f1;
  & > section.logo {
    color: #fff;
    font-size: 30px;
    font-weight: border;
    margin-right: 60px;
  }
  & > section.operation {
    margin-left: 150px;
    & > button {
      margin-right: 20px;
      border-radius: 5px;
    }
  }
`;

type AnchorItemProps = {
  active: boolean;
};

const AnchorItem = styled.a<AnchorItemProps>`
  font-size: 18px;
  padding: 0 20px;
  color: ${({ active }) => (active ? '#1890ff' : '#515767')};
`;
