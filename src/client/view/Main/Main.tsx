import React, { FC } from 'react';
import classes from './Main.module.scss';
import { Typography } from 'antd';
const { Title } = Typography;
import { IMainData } from '../../types/data';
import Link from 'next/link';

interface IMain {
  data: IMainData;
}

const Main: FC<IMain> = ({ data }) => {
  return (
    <div className={classes.container}>
      <Title level={2} className={classes.container_textMainPage}>
        Main Page Text
      </Title>
      <Link href={'/secondPage'}>Second Page</Link>
    </div>
  );
};

export default Main;
