import { useRouter } from "next/router";
import { api } from "../../../utils/api";
import { useSession } from "next-auth/react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Loading } from "../../../components/Loading";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AcceptHostInvite() {
  const router = useRouter();
  const { token } = router.query;
  const { data: session, status } = useSession();

  const acceptHostInviteMutation = api.events.acceptHostInvite.useMutation({
    onSuccess: (response) => {
      toast.success(response.message);
      void router.push(`/events/${response.event.publicId}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (status === "loading") {
    return <Loading />;
  }

  if (!session) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Please sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You need to be signed in to accept this co-host invitation.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token || typeof token !== "string") {
    return (
      <div className="container flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>The invitation link is invalid or has expired.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Accept Co-Host Invitation</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <p>You have been invited to co-host this event.</p>
          <Button
            onClick={() => {
              acceptHostInviteMutation.mutate({ token });
            }}
            disabled={acceptHostInviteMutation.isLoading}
          >
            {acceptHostInviteMutation.isLoading
              ? "Accepting..."
              : "Accept Invitation"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
