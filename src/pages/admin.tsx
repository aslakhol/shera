import Head from "next/head";
import { type NextPageWithLayout } from "./_app";
import { MainLayout } from "../components/Layout";
import { type ReactElement } from "react";
import { useIsDev } from "../utils/useIsDev";
import { Admin } from "../components/admin/Admin";

const AdminPage: NextPageWithLayout = () => {
  const isDev = useIsDev();

  return (
    <main className="flex flex-grow flex-col items-center">
      <div>
        <h2 className="pb-4 text-2xl font-bold tracking-tight text-primary">
          Admin
        </h2>
        {isDev ? <Admin /> : <p>You are not authorized to view this page</p>}
      </div>
    </main>
  );
};

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>Admin | Shera</title>
        <meta name="description" content="Admin page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {page}
    </MainLayout>
  );
};

export default AdminPage;
