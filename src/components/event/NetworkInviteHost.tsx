import React from "react";
import { type EventWithHosts } from "../../utils/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

type NetworkInviteHostProps = {
  event: EventWithHosts;
};

export const NetworkInviteHost = ({ event }: NetworkInviteHostProps) => {
  // TODO: Implement network fetching, user selection, and mutation call
  return (
    <div className="p-1">
      <Card>
        <CardHeader>
          <CardTitle>Invite from Network</CardTitle>
          <CardDescription>
            Select users from your network to invite as co-hosts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Network invite form placeholder for event: {event.title}</p>
          {/* User selection list will go here */}
        </CardContent>
      </Card>
    </div>
  );
};
