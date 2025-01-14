import React, { FC } from 'react';
import classes from './Header.module.scss';
import { Layout } from 'antd';
import Title from 'antd/lib/typography/Title';
interface IHeader {
  title: string;
  sub_title: string;
  children?: string | JSX.Element | JSX.Element[];
}

const Header: FC<IHeader> = ({ title, sub_title, children }) => {
  return (
    <Layout.Header className={classes.container}>
      <div className={classes.container__top}>
        <Title level={1}>{title}</Title>
        <Title level={1}>{sub_title}</Title>
      </div>
      {children}
    </Layout.Header>
  );
};

export default Header;
