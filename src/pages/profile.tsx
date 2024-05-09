import Head from "next/head";
import { ProfileForm } from "../components/ProfileForm";
import { useSession } from "next-auth/react";
import { type NextPageWithLayout } from "./_app";
import { MainLayout } from "../components/Layout";
import { type ReactElement } from "react";

const ProfilePage: NextPageWithLayout = () => {
  const session = useSession();
  const user = session.data?.user;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="pb-4 text-2xl font-bold tracking-tight text-primary">
        Profile
      </h2>
      {user && <ProfileForm user={user} />}
    </div>
  );
};

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>Profile | Shera</title>
        <meta name="description" content="Profile page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {page}
    </MainLayout>
  );
};

export default ProfilePage;
