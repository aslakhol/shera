import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState, type Dispatch, type SetStateAction } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { api } from "../../utils/api";
import { toast } from "sonner";
import { type EventWithHosts } from "../../utils/types";
import { useSession } from "next-auth/react";
import { type User } from "@prisma/client";

type EmailInviteHostProps = {
  event: EventWithHosts;
  emails: string[];
  setEmails: Dispatch<SetStateAction<string[]>>;
};

export const EmailInviteHost = ({
  event,
  emails,
  setEmails,
}: EmailInviteHostProps) => {
  const { data: session } = useSession();
  const [emailInput, setEmailInput] = useState("");
  const utils = api.useUtils();

  const emailInviteHostMutation = api.events.emailInviteHost.useMutation({
    onSuccess: (response) => {
      toast.success(
        `${response.createdInvites} co-host invite${response.createdInvites > 1 ? "s" : ""} sent.`,
      );
      void utils.events.event.invalidate({
        publicId: event.publicId,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailsInInput = emailInput.trim().split(",");
    if (emailsInInput.length > 0) {
      setEmails((prev) => {
        const newEmails = emailsInInput
          .map((email) => email.trim())
          .filter((email) => email.length > 0)
          .filter((email) => !prev.includes(email))
          .filter(
            (email) => !event.hosts.some((host: User) => host.email === email),
          );

        return [...prev, ...newEmails];
      });
    }
    setEmailInput("");
  };

  const handleSend = () => {
    if (emails.length === 0 || !session) {
      return;
    }

    emailInviteHostMutation.mutate({
      publicId: event.publicId,
      emails,
    });

    setEmails([]);
  };

  return (
    <div className="flex flex-1 flex-col justify-between overflow-auto">
      <div className="flex flex-1 flex-col gap-2 overflow-auto p-1">
        <div className="flex flex-col gap-1.5">
          <form onSubmit={handleAdd}>
            <Label htmlFor="email">Emails</Label>
            <div className="flex gap-1.5">
              <Input
                type="email"
                id="email"
                multiple
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
              />
              <Button variant="outline">
                <Plus />
              </Button>
            </div>
            <p className={cn("text-sm text-muted-foreground")}>
              Separate multiple emails with comma
            </p>
          </form>
        </div>

        {emails.length > 0 && (
          <div className="flex flex-col gap-1 overflow-auto">
            <p className="text-md font-semibold text-primary">Ready to send</p>
            <div className="flex flex-col overflow-scroll">
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
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleSend}
        disabled={
          emailInput.trim().length !== 0 ||
          emails.length === 0 ||
          emailInviteHostMutation.isLoading
        }
      >
        Send co-host invites
      </Button>
    </div>
  );
};
