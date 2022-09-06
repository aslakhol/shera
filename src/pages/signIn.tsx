import { InferGetServerSidePropsType, NextPage } from "next";
import { getProviders } from "next-auth/react";
import Head from "next/head";
import SignIn from "../features/auth/SignIn";

const SignInPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const { providers } = props;

  return (
    <>
      <Head>
        <title>Sign In</title>
        <meta name="description" content="signIn" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {providers && <SignIn providers={providers} callbackUrl="/" />}
    </>
  );
};

export default SignInPage;

export const getServerSideProps = async () => {
  const providers = await getProviders();

  return {
    props: { providers },
  };
};
