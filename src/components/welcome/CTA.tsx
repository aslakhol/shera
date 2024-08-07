import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";

export const CTA = () => {
  const { data: session } = useSession();

  if (session === undefined) {
    return (
      <>
        <Button className="invisible">Placeholder button</Button>
      </>
    );
  }

  return (
    <>
      {session !== null ? (
        <Button
          asChild
          className="border shadow-lg hover:text-primary-foreground/80"
        >
          <Link href={"/events/new"}>Create event</Link>
        </Button>
      ) : (
        <Button asChild>
          <Link
            href={"/auth/signin?callbackUrl=/events/new"}
            className="border shadow-lg hover:text-primary-foreground/80"
          >
            Create event
          </Link>
        </Button>
      )}
    </>
  );
};
