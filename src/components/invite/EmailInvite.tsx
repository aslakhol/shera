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
  emails: string[];
  setEmails: (emails: string[]) => void;
};

// aaaaa@gmail.com, aaaaa@outlook.com, aaaaa@yahoo.com, aaaaa@hotmail.com, aaaaa@live.com, aaaaa@icloud.com, aaaaa@me.com,  aaaaa@aol.com,  aaaaa@msn.com, bbbbb@gmail.com, bbbbb@outlook.com, bbbbb@yahoo.com, bbbbb@hotmail.com, bbbbb@live.com, bbbbb@icloud.com, bbbbb@me.com,  bbbbb@aol.com,  bbbbb@msn.com, ccccc@gmail.com, ccccc@outlook.com, ccccc@yahoo.com, ccccc@hotmail.com, ccccc@live.com, ccccc@icloud.com, ccccc@me.com,  ccccc@aol.com,  ccccc@msn.com

export const EmailInvite = ({ event, emails, setEmails }: Props) => {
  const attendeesQuery = api.events.attendees.useQuery({
    publicId: event.publicId,
  });
  const invited = attendeesQuery.data?.filter((a) => a.status === "INVITED");
  const [emailInput, setEmailInput] = useState("");
  const utils = api.useUtils();
  const emailInviteMutation = api.events.emailInvite.useMutation({
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

    emailInviteMutation.mutate({
      publicId: event.publicId,
      emails: emailsToSend,
      inviterName: event.host.name ?? undefined,
    });

    setEmails([]);
  };

  return (
    <div className="flex flex-1 flex-col justify-between overflow-auto  ">
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
          emailInviteMutation.isLoading
        }
      >
        Send invite emails
      </Button>
    </div>
  );
};
