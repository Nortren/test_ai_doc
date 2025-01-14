import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import Main from '../view/Main/Main';
import { getQuestions } from '../api/api';

const Index: NextPage = ({ data }: any) => {
  return <Main data={data} />;
};

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      data: [],
    },
  };
};

export default Index;
