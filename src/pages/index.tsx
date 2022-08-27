import Footer from "@/features/footer/compontents/Footer";
import Welcome from "@/features/welcome/components/Welcome";
import type { NextPage } from "next";
import Head from "next/head";
import NavBar from "../features/navbar/Components/NavBar";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Shera</title>
        <meta name="description" content="Welcome page for Shera" />
      </Head>
      <NavBar />
      <Welcome />
      <Footer />
    </>
  );
};

export default Home;
