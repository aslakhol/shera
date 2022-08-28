import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSession } from "next-auth/react";
import Link from "next/link";

type SignedOutProps = { session: ReturnType<typeof useSession> };

const SignedOut = (props: SignedOutProps) => {
  const { session } = props;

  if (session.status !== "unauthenticated") {
    return <></>;
  }

  return (
    <>
      <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full flex flex-col justify-center ">
          <FontAwesomeIcon icon={faUser} size="2x" className="py-1" />
        </div>
      </label>
      <ul
        tabIndex={0}
        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
      >
        <li>
          <Link href={"/api/auth/signin"}>
            <a>Sign In</a>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default SignedOut;
