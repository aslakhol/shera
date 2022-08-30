import { NextPage } from "next";
import Head from "next/head";
import PrivacyPolicy from "../features/privacy/PrivacyPolicy";

const PrivacyPolicyPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
        <meta name="description" content="Privacy policy for Shera" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PrivacyPolicy />
    </>
  );
};

export default PrivacyPolicyPage;
