import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { type EventSchemaType } from "../../utils/formValidation";
import { EventForm } from "../EventForm";
import { toast } from "sonner";
import { useRouter } from "next/router";
import { Loading } from "../Loading";
import { fullEventId } from "../../utils/event";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
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
import React, { useState } from "react";
import { type User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = { publicId: string };

export const EditEvent = ({ publicId }: Props) => {
  const session = useSession();
  const router = useRouter();
  const utils = api.useUtils();
  const [hostToRemove, setHostToRemove] = useState<User | null>(null);

  const eventQuery = api.events.event.useQuery(
    {
      publicId,
    },
    {
      refetchOnWindowFocus: true,
    },
  );

  const updateEventMutation = api.events.updateEvent.useMutation({
    onSuccess: (response) => {
      toast.success(`${response.event.title} updated`);
      return router.push(`/events/${fullEventId(response.event)}`);
    },
    onError: (error) => {
      toast.error(`Failed to update event: ${error.message}`);
    },
  });

  const removeHostMutation = api.events.removeHost.useMutation({
    onSuccess: (response) => {
      toast.success(`Host removed from ${response.event.title}`);
      void utils.events.event.invalidate({ publicId });
      setHostToRemove(null);
    },
    onError: (error) => {
      toast.error(`Failed to remove host: ${error.message}`);
      setHostToRemove(null);
    },
  });

  const handleUpdateEvent = (values: EventSchemaType) => {
    if (!session.data?.user) {
      return;
    }
    updateEventMutation.mutate({ publicId, ...values });
  };

  const handleRemoveHost = () => {
    if (!hostToRemove || !eventQuery.data) {
      return;
    }
    removeHostMutation.mutate({
      publicId: eventQuery.data.publicId,
      userIdToRemove: hostToRemove.id,
    });
  };

  if (eventQuery.isLoading || !eventQuery.data) {
    return <Loading />;
  }

  const currentUserId = session.data?.user?.id;
  const isHost = eventQuery.data.hosts.some(
    (host) => host.id === currentUserId,
  );

  if (!isHost) {
    if (session.status === "loading") {
      return <Loading />;
    }
    return <>No access to edit event</>;
  }

  const eventData = eventQuery.data;
  const hosts = eventData.hosts;
  const canRemoveHosts = hosts.length > 1;

  return (
    <div className="space-y-6">
      <EventForm
        onSubmit={handleUpdateEvent}
        event={eventData}
        mutationIsLoading={updateEventMutation.isLoading}
      />

      <Card>
        <CardHeader>
          <CardTitle>Manage Hosts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button
              onClick={() =>
                toast.info("Invite Co-host functionality coming soon!")
              }
            >
              Invite Co-host
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hosts.map((host) => (
                <TableRow key={host.id}>
                  <TableCell>{host.name ?? "N/A"}</TableCell>
                  <TableCell>{host.email ?? "N/A"}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={
                            !canRemoveHosts || host.id === currentUserId
                          }
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
                              <strong>
                                {hostToRemove.name ?? hostToRemove.email}
                              </strong>{" "}
                              as a host. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              onClick={() => setHostToRemove(null)}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleRemoveHost}
                              disabled={removeHostMutation.isLoading}
                            >
                              {removeHostMutation.isLoading
                                ? "Removing..."
                                : "Confirm"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      )}
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!canRemoveHosts && (
            <p className="mt-2 text-sm text-muted-foreground">
              You cannot remove the only host. Invite another host first.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
