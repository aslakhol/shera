import EditProfile from "@/features/profile/EditProfile";
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
      <EditProfile />
    </>
  );
};

export default ProfilePage;
