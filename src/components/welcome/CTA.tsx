import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";

export const CTA = () => {
  const { data: session } = useSession();

  if (session === undefined) {
    return <Button className="invisible">Placeholder button</Button>;
  }

  const ctaLink = session
    ? "/events/new"
    : "/auth/signin?callbackUrl=/events/new";

  return (
    <Button
      asChild
      className="rounded-xl border p-6 text-lg shadow-lg hover:text-primary-foreground/80"
    >
      <Link href={ctaLink}>Create an event</Link>
    </Button>
  );
};
