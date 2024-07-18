import Head from "next/head";
import { type NextPageWithLayout } from "./_app";
import { AdminLayout } from "../components/Layout";
import { useEffect, useState, type ReactElement } from "react";
import { useIsDev } from "../utils/useIsDev";
import { Admin } from "../components/admin/Admin";

const AdminPage: NextPageWithLayout = () => {
  const isDev = useIsDev();

  const [userAgent, setUserAgent] = useState("");

  useEffect(() => {
    if (navigator) {
      setUserAgent(navigator.userAgent);
    }
  }, []);

  return (
    <div className="p-4">
      <h2 className="pb-4 text-2xl font-bold tracking-tight text-primary">
        Admin
      </h2>
      {isDev ? <Admin /> : <p>You are not authorized to view this page</p>}
      <span>User agent: {userAgent}</span>
    </div>
  );
};

AdminPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <AdminLayout>
      <Head>
        <title>Admin | Shera</title>
        <meta name="description" content="Admin page for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {page}
    </AdminLayout>
  );
};

export default AdminPage;
