import { useSession } from "next-auth/react";
import { Welcome } from "../components/welcome/Welcome";
import { type NextPageWithLayout } from "./_app";
import { useRouter } from "next/router";

const Home: NextPageWithLayout = () => {
  const session = useSession();
  const router = useRouter();

  if (session.status === "authenticated") {
    void router.replace("/events");
  }

  return <Welcome />;
};

export default Home;
