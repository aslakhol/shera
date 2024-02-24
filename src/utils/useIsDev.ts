import { useSession } from "next-auth/react";

export const useIsDev = () => {
  const { data: session } = useSession();

  const approvedDevs = ["aslakhol@gmail.com"];

  return (
    (session?.user?.email && approvedDevs.includes(session.user.email)) ?? false
  );
};
