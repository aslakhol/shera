import Head from "next/head";
import { type NextPageWithLayout } from "./_app";
import { MainLayout } from "../components/Layout";
import { type ReactElement } from "react";
import PrivacyPolicy from "../components/privacy/PrivacyPolicy";

const PrivacyPolicyPage: NextPageWithLayout = () => {
  return <PrivacyPolicy />;
};

PrivacyPolicyPage.getLayout = function getLayout(page: ReactElement) {
  return (
    <MainLayout>
      <Head>
        <title>Privacy | Shera</title>
        <meta name="description" content="Privacy policy for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {page}
    </MainLayout>
  );
};

export default PrivacyPolicyPage;
