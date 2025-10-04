import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "~/utils/api";
import { fullEventId } from "~/utils/event";
import { useSession, signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Loading } from "../../components/Loading";

const AcceptInvitePage = () => {
  const router = useRouter();
  const { token } = router.query as { token?: string };
  const { status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const acceptMutation = api.events.acceptHostInvite.useMutation({
    onSuccess: (res) => {
      if (res.event) {
        const path = fullEventId({
          title: res.event.title,
          publicId: res.event.publicId,
        });
        void router.replace(`/events/${path}`);
      }
    },
    onError: (err) => {
      console.log(err);
      setError(err.message);
    },
  });

  useEffect(() => {
    if (!token) return;
    if (status === "unauthenticated") return;
    if (status === "loading") return;
    acceptMutation.mutate({ token });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, status]);

  if (status === "loading") {
    return <Loading />;
  }

  if (!token) {
    return <div className="p-4">Invalid or missing token.</div>;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col items-start gap-3 p-4">
        <div className="text-sm">
          Please sign in to accept the co-host invitation.
        </div>
        <Button onClick={() => signIn()}>Sign in</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {error && <div className="text-red-600">{error}</div>}
      {!error && <Loading />}
    </div>
  );
};

export default AcceptInvitePage;
