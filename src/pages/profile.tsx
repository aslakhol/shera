import Head from "next/head";
import { ProfileForm } from "../components/ProfileForm";
import { useSession } from "next-auth/react";
import { type NextPageWithLayout } from "./_app";
import { MainLayout } from "../components/Layout";
import { type ReactElement } from "react";
import { api } from "../utils/api";
import { Button } from "../components/ui/button";
import Link from "next/link";

const ProfilePage: NextPageWithLayout = () => {
  const session = useSession();
  const user = session.data?.user;
  const isLinkedToGoogleQuery = api.users.isLinkedToGoogle.useQuery(
    {
      userId: user?.id ?? "",
    },
    { enabled: !!user?.id },
  );

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="pb-4 text-2xl font-bold tracking-tight text-primary">
        Profile
      </h2>
      {user && <ProfileForm user={user} />}
      {!isLinkedToGoogleQuery.data && (
        <>
          <hr></hr>
          <h2 className="py-4 text-2xl font-bold tracking-tight text-primary">
            Login
          </h2>
          <div className="flex flex-col  gap-2">
            <Button variant="outline" asChild>
              <Link href={"/auth/signin?callbackUrl=/profile"}>
                Link to Google
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Link with Google account is only used for login.
            </p>
          </div>
        </>
      )}
      <hr />
      <div>
        <iframe
          src="https://embeds.beehiiv.com/bf777115-9d0a-458b-9805-56825cadf010"
          data-test-id="beehiiv-embed"
          width="100%"
          height="320"
          frameBorder="0"
          scrolling="no"
          style={{
            borderRadius: "4px",
            border: "2px solid #e5e7eb",
            margin: "0",
            backgroundColor: "transparent",
          }}
        ></iframe>
      </div>
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
