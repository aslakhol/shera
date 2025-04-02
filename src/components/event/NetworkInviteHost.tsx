import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, type UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { api } from "../../utils/api";
import { type EventWithHosts, type Friend } from "../../utils/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { cn } from "../../utils/cn";
import { Loading } from "../Loading";

const networkInviteHostSchema = z.object({
  selectedUserIds: z.array(z.string()),
});
type NetworkInviteHostFormValues = z.infer<typeof networkInviteHostSchema>;

type NetworkInviteHostProps = {
  event: EventWithHosts;
};

export const NetworkInviteHost = ({ event }: NetworkInviteHostProps) => {
  const [search, setSearch] = useState("");
  const session = useSession();
  const utils = api.useUtils();

  const form = useForm<NetworkInviteHostFormValues>({
    resolver: zodResolver(networkInviteHostSchema),
    defaultValues: {
      selectedUserIds: [],
    },
  });

  const networkInviteHostMutation = api.events.networkInviteHost.useMutation({
    onSuccess: (response) => {
      if (response.createdInvites > 0) {
        toast.success(
          `${response.createdInvites} co-host invite${response.createdInvites > 1 ? "s" : ""} sent.`,
        );
        void utils.events.event.invalidate({ publicId: event.publicId });
      } else {
        toast.info("No new invites sent.");
      }
      form.reset();
    },
    onError: (error) => {
      toast.error(`Failed to send invites: ${error.message}`);
    },
  });

  const networkQuery = api.events.network.useQuery(
    {
      userId: session.data?.user?.id ?? "",
    },
    { enabled: !!session.data?.user?.id },
  );

  const onSubmit = (data: NetworkInviteHostFormValues) => {
    networkInviteHostMutation.mutate({
      publicId: event.publicId,
      inviteeIds: data.selectedUserIds,
    });
  };

  const hostIds = event.hosts.map((h) => h.id);
  const friends =
    networkQuery.data
      ?.filter(
        (f) =>
          f.name.toLowerCase().includes(search.toLowerCase()) ||
          f.events.some((e) =>
            e.title.toLowerCase().includes(search.toLowerCase()),
          ),
      )
      .sort((a, b) => a.name.localeCompare(b.name)) ?? [];

  if (networkQuery.isLoading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-auto p-1">
      <Input
        type="search"
        id="search"
        value={search}
        placeholder="Search for person or event"
        onChange={(e) => setSearch(e.target.value)}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-1 flex-col justify-between overflow-auto"
        >
          <div className="flex-1 overflow-scroll">
            <FormField
              control={form.control}
              name="selectedUserIds"
              render={() => (
                <FormItem>
                  {friends.map((friend) => (
                    <NetworkHostCandidate
                      friend={friend}
                      key={friend.userId}
                      form={form}
                      isHost={hostIds.includes(friend.userId)}
                    />
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-row gap-2">
            <Button
              variant="outline"
              className="w-full"
              type="submit"
              disabled={
                form.watch("selectedUserIds").length === 0 ||
                networkInviteHostMutation.isLoading
              }
            >
              Send invites
            </Button>
            <Button
              variant="outline"
              className="w-full flex-1"
              type="button"
              disabled={form.watch("selectedUserIds").length === 0}
              onClick={() => form.reset()}
            >
              Reset
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

type NetworkHostCandidateProps = {
  friend: Friend;
  form: UseFormReturn<NetworkInviteHostFormValues>;
  isHost: boolean;
};

const NetworkHostCandidate = ({
  friend,
  form,
  isHost,
}: NetworkHostCandidateProps) => {
  const events = friend.events.map((e) => e.title).join(", ");

  return (
    <FormField
      key={friend.userId}
      control={form.control}
      name="selectedUserIds"
      render={({ field }) => {
        const selectedIds = Array.isArray(field.value) ? field.value : [];
        return (
          <FormItem
            key={friend.userId}
            className={cn(
              "flex flex-row items-start space-x-3 rounded p-1",
              !isHost && "hover:bg-muted",
            )}
          >
            <FormLabel
              className={cn(
                "flex w-full cursor-pointer flex-row items-center justify-between rounded py-1",
              )}
            >
              <div className={cn(isHost && "opacity-50")}>
                <p className="text-md line-clamp-1 font-medium">
                  {friend.name}
                </p>
                <p className="line-clamp-1 text-sm font-normal">
                  {!isHost ? `Met at: ${events}` : "Already a host"}
                </p>
              </div>
              <FormControl>
                <Checkbox
                  disabled={isHost}
                  checked={selectedIds.includes(friend.userId)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange([...selectedIds, friend.userId])
                      : field.onChange(
                          selectedIds.filter(
                            (value: string) => value !== friend.userId,
                          ),
                        );
                  }}
                />
              </FormControl>
            </FormLabel>
          </FormItem>
        );
      }}
    />
  );
};
