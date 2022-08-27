import { NextPage } from "next";
import Head from "next/head";

const ProfilePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="prose p-4">
        <h1>Profile</h1>
        <p>There is no profile page yet</p>
      </div>
    </>
  );
};

export default ProfilePage;
