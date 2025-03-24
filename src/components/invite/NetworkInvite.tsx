import { Button } from "../ui/button";
import { type User, type Event } from "@prisma/client";
import { Input } from "../ui/input";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import { type Friend } from "../../utils/types";
import { type z } from "zod";
import { toast } from "sonner";
import { type UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";
import { type NetworkInviteFormSchema } from "./utils";

type Props = {
  event: Event & { host: User };
  form: UseFormReturn<z.infer<typeof NetworkInviteFormSchema>>;
};

export const NetworkInvite = ({ event, form }: Props) => {
  const [search, setSearch] = useState("");
  const utils = api.useUtils();
  const session = useSession();
  const networkInviteMutation = api.events.networkInvite.useMutation({
    onSuccess: (response) => {
      toast.success(
        `${response.invites} invite${response.invites > 1 ? "s" : ""} sent.`,
      );
      void utils.events.attendees.invalidate({
        publicId: event.publicId,
      });
      form.reset();
    },
  });

  const attendeesQuery = api.events.attendees.useQuery({
    publicId: event.publicId,
  });
  const networkQuery = api.events.network.useQuery(
    {
      userId: session.data?.user.id ?? "",
    },
    { enabled: !!session.data?.user.id },
  );

  const onSubmit = (data: z.infer<typeof NetworkInviteFormSchema>) => {
    networkInviteMutation.mutate({
      publicId: event.publicId,
      friendsUserIds: data.friends,
      inviterName: session.data?.user.name ?? undefined,
    });
  };

  const friends =
    networkQuery.data
      ?.filter(
        (f) =>
          f.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()) ||
          f.events.some((e) =>
            e.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
          ),
      )
      .sort((a, b) => a.name.localeCompare(b.name)) ?? [];

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
              name="friends"
              render={() => (
                <FormItem>
                  {friends.map((friend) => (
                    <NetworkFriend
                      friend={friend}
                      key={friend.userId}
                      form={form}
                      attending={
                        attendeesQuery.data?.some(
                          (a) => a.userId === friend.userId,
                        ) ?? false
                      }
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
                form.watch("friends").length === 0 ||
                networkInviteMutation.isLoading
              }
            >
              Send invites
            </Button>
            <Button
              variant="outline"
              className="w-full flex-1"
              type="button"
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

type NetworkFriendProps = {
  friend: Friend;
  form: UseFormReturn<z.infer<typeof NetworkInviteFormSchema>>;
  attending: boolean;
};

const NetworkFriend = ({ friend, form, attending }: NetworkFriendProps) => {
  const events = friend.events.map((e) => e.title).join(", ");

  return (
    <FormField
      key={friend.userId}
      control={form.control}
      name="friends"
      render={({ field }) => {
        return (
          <FormItem
            key={friend.userId}
            className={cn(
              "flex flex-row items-start space-x-3 rounded p-1",
              !attending && "hover:bg-muted",
            )}
          >
            <FormLabel
              className={cn(
                "flex w-full cursor-pointer flex-row items-center justify-between rounded py-1",
              )}
            >
              <div className={cn(attending && "opacity-50")}>
                <p className="text-md line-clamp-1 font-medium">
                  {friend.name}
                </p>
                <p className="line-clamp-1 text-sm font-normal">
                  {!attending ? events : "Already invited"}
                </p>
              </div>
              <FormControl>
                <Checkbox
                  disabled={attending}
                  checked={field.value?.includes(friend.userId)}
                  onCheckedChange={(checked) => {
                    return checked
                      ? field.onChange([...field.value, friend.userId])
                      : field.onChange(
                          field.value?.filter(
                            (value) => value !== friend.userId,
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
