import { type User, type Event } from "@prisma/client";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { Button } from "../ui/button";

type Props = {
  event: Event & {
    host: User;
  };
};

export const EmailInvite = ({ event }: Props) => {
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [sentEmails, setSentEmails] = useState<string[]>([]);

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const emailsInInput = emailInput.trim().split(",");
      if (emailsInInput.length > 0) {
        setEmails((prev) => {
          const newEmails = emailsInInput.filter(
            (email) => !prev.includes(email),
          );

          return [...prev, ...newEmails];
        });
        setEmailInput("");
      }
    }
  };

  const handleSend = () => {
    if (emails.length === 0) {
      return;
    }

    const emailsToSend = emails.filter((email) => !sentEmails.includes(email));

    emailsToSend.forEach((email) => {
      console.log("Sending email", email);
      setSentEmails((prev) => [...prev, email]);
    });

    setEmails([]);
  };

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Invite by Email</Label>
        <Input
          type="text"
          id="email"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
          onKeyDown={handleEnter}
        />
        <p className={cn("text-sm text-muted-foreground")}>
          Separate multiple emails with comma
        </p>
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

      {sentEmails.length > 0 && (
        <div className="flex flex-col gap-1.5">
          <p className="text-md font-semibold text-primary">Emails sent</p>
          <div className="flex flex-col gap-1.5">
            {sentEmails.map((email, index) => (
              <p key={`email-${index}`}>{email}</p>
            ))}
          </div>
        </div>
      )}

      <Button variant="outline" className="w-full" onClick={handleSend}>
        Send invite emails
      </Button>
    </>
  );
};
