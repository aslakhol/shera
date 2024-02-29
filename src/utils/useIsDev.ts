import { useSession } from "next-auth/react";

const approvedDevs = ["aslakhol@gmail.com"];

export const useIsDev = () => {
  const { data: session } = useSession();

  const isDev =
    session?.user?.email && approvedDevs.includes(session.user.email)
      ? true
      : false;

  return isDev;
};
