import React from "react";
import { type EventWithHosts } from "../../utils/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type EmailInviteHostProps = {
  event: EventWithHosts;
};

export const EmailInviteHost = ({ event }: EmailInviteHostProps) => {
  // TODO: Implement email input form and mutation call
  return (
    <div className="p-1">
      <Card>
        <CardHeader>
          <CardTitle>Invite by Email</CardTitle>
          <CardDescription>
            Enter the email addresses of the users you want to invite as
            co-hosts. They must have a Shera account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Email invite form placeholder for event: {event.title}</p>
          {/* Form elements will go here */}
        </CardContent>
      </Card>
    </div>
  );
};
