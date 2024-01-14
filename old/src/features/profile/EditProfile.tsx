import Spinner from "@/components/Spinner";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ProfileForm from "./ProfileForm";

const EditProfile = () => {
  const { data: session } = useSession();

  if (session === undefined) {
    return (
      <div className="flex w-full h-[50vh] justify-center items-center">
        <Spinner />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="flex flex-col items-center min-h-screen-content mx-auto py-8 w-10/12 md:w-1/2">
        <div className="prose p-4">
          <h1>Profile</h1>
          <p>You must be logged in to see the profile page.</p>
          <Link href={"/api/auth/signin"}>
            <button className="btn">Sign in</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen-content mx-auto py-8 w-10/12 md:w-1/2">
      <div className="prose p-4">
        <h1>Profile</h1>
        <ProfileForm user={session?.user} />
      </div>
    </div>
  );
};

export default EditProfile;
