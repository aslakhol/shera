import React, { useState } from "react";
import { type User } from "@prisma/client";
import { api } from "../../utils/api";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { type EventWithHosts } from "../../utils/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getInitials } from "../../utils/user";

type Props = {
  event: EventWithHosts;
};

export const EventHosts = ({ event }: Props) => {
  const utils = api.useUtils();
  const [hostToRemove, setHostToRemove] = useState<User | null>(null);

  const removeHostMutation = api.events.removeHost.useMutation({
    onSuccess: (response) => {
      toast.success(`Host removed from ${response.event.title}`);
      void utils.events.event.invalidate({ publicId: event.publicId });
      setHostToRemove(null);
    },
    onError: (error) => {
      toast.error(`Failed to remove host: ${error.message}`);
      setHostToRemove(null);
    },
  });

  const handleRemoveHost = () => {
    if (!hostToRemove) {
      return;
    }
    removeHostMutation.mutate({
      publicId: event.publicId,
      userIdToRemove: hostToRemove.id,
    });
  };

  const hosts = event.hosts;
  const canRemoveHosts = hosts.length > 1;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle>Hosts</CardTitle>
        <Button
          onClick={() => toast.info("Invite host functionality coming soon!")}
          size="sm"
        >
          Invite
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {hosts.map((host) => (
          <div
            key={host.id}
            className="flex items-center justify-between space-x-4"
          >
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src={host.image ?? undefined} />
                <AvatarFallback>
                  {getInitials(host.name ?? host.email ?? "?")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">
                  {host.name ?? "Unnamed Host"}
                </p>
                <p className="text-sm text-muted-foreground">{host.email}</p>
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!canRemoveHosts}
                  onClick={() => setHostToRemove(host)}
                >
                  Remove
                </Button>
              </AlertDialogTrigger>
              {hostToRemove?.id === host.id && (
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove{" "}
                      <strong>{hostToRemove.name ?? hostToRemove.email}</strong>
                      {` as a host from "${event.title}". This action cannot be undone.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setHostToRemove(null)}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRemoveHost}
                      disabled={removeHostMutation.isLoading}
                    >
                      {removeHostMutation.isLoading ? "Removing..." : "Confirm"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              )}
            </AlertDialog>
          </div>
        ))}

        {!canRemoveHosts && (
          <p className="pt-2 text-sm text-muted-foreground">
            Cannot remove the only host. Invite another host first.
          </p>
        )}
      </CardContent>
    </Card>
  );
};
