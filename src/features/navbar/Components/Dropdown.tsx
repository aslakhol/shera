import { useSession } from "next-auth/react";
import SignedIn from "./SignedIn";
import SignedOut from "./SignedOut";

const Dropdown = () => {
  const session = useSession();

  if (session.status === "loading") {
    return <></>;
  }

  return (
    <div className="dropdown dropdown-end">
      {session.status == "authenticated" ? (
        <SignedIn session={session} />
      ) : (
        <SignedOut session={session} />
      )}
    </div>
  );
};

export default Dropdown;
