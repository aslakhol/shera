import { useSession } from "next-auth/react";
import Link from "next/link";

const WelcomeActionButton = () => {
  const { data: session } = useSession();

  if (session === undefined) {
    return (
      <>
        <button className="btn invisible">Placeholder button</button>
      </>
    );
  }

  return (
    <>
      {session !== null ? (
        <Link href={"/events/new"}>
          <button className="btn">Create event</button>
        </Link>
      ) : (
        <Link href={"/api/auth/signin"}>
          <button className="btn">Sign in</button>
        </Link>
      )}
    </>
  );
};

export default WelcomeActionButton;
