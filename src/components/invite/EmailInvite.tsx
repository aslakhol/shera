import { type User, type Event } from "@prisma/client";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { api } from "../../utils/api";
import { toast } from "sonner";

type Props = {
  event: Event & {
    host: User;
  };
};

export const EmailInvite = ({ event }: Props) => {
  const attendeesQuery = api.events.attendees.useQuery({
    publicId: event.publicId,
  });
  const invited = attendeesQuery.data?.filter((a) => a.status === "INVITED");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const utils = api.useUtils();
  const inviteMutation = api.events.invite.useMutation({
    onSuccess: (response) => {
      toast.success(
        `${response.totalInvites} invite${response.totalInvites > 1 ? "s" : ""} sent.`,
      );
      void utils.events.attendees.invalidate({
        publicId: event.publicId,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAdd = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const emailsInInput = emailInput.trim().split(",");
    if (emailsInInput.length > 0) {
      setEmails((prev) => {
        const newEmails = emailsInInput
          .filter((email) => !prev.includes(email))
          .filter(
            (email) => !attendeesQuery.data?.some((a) => a.email === email),
          );

        return [...prev, ...newEmails];
      });
    }
    setEmailInput("");
  };

  const handleSend = () => {
    if (emails.length === 0) {
      return;
    }

    const emailsToSend = emails.filter((email) =>
      invited?.every((a) => a.email !== email),
    );

    inviteMutation.mutate({
      publicId: event.publicId,
      emails: emailsToSend,
      inviterName: event.host.name ?? undefined,
    });

    setEmails([]);
  };

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <form onSubmit={handleAdd}>
          <Label htmlFor="email">Invite by Email</Label>
          <div className="flex gap-1.5">
            <Input
              type="email"
              id="email"
              multiple
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <Button variant={"outline"}>
              <Plus />
            </Button>
          </div>
          <p className={cn("text-sm text-muted-foreground")}>
            Separate multiple emails with comma
          </p>
        </form>
      </div>

      {emails.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-md font-semibold text-primary">Ready to send</p>
          <div className="flex flex-col gap-1.5">
            {emails.map((email, index) => (
              <p
                key={`email-${index}`}
                className="hover:underline"
                onClick={() =>
                  setEmails((prev) => prev.filter((e) => e !== email))
                }
              >
                {email}
              </p>
            ))}
          </div>
        </div>
      )}

      {invited && invited.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-md font-semibold text-primary">Invited</p>
          <div className="flex flex-col gap-1.5">
            {invited.map((attendee, index) => (
              <p key={`attendee-${index}`}>{attendee.name}</p>
            ))}
          </div>
        </div>
      )}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleSend}
        disabled={emailInput.trim().length !== 0 || emails.length === 0}
      >
        Send invite emails
      </Button>
    </>
  );
};
