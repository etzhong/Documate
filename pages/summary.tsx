import React from 'react';
import { GetServerSideProps } from 'next';
import {connectToDatabase } from '../lib/db';

type HomepageProps = {
  content: string;
};

const Homepage: React.FC<HomepageProps> = ({ content }) => {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};

export default Homepage;

export const getServerSideProps: GetServerSideProps = async () => {
  let content = "";
  // Only call the connectToDatabase function on the server side
  if (typeof window === 'undefined') {
    content = await connectToDatabase();
  } else {
    content = '<div>Running on client side</div>';
  }
  return { props: { content } };
};