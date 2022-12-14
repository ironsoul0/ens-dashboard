import { Dashboard } from "components";
import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Joystream | ENS Dashboard</title>
        <meta name="description" content="Joystream | ENS Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Dashboard />
    </div>
  );
};

export default Home;
