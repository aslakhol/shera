import { Button } from "../ui/button";
import { type User, type Event } from "@prisma/client";
import { Input } from "../ui/input";
import { useState } from "react";
import { cn } from "../../utils/cn";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import { type Friend } from "../../utils/types";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { type UseFormReturn, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";

const FormSchema = z.object({
  friends: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type Props = { event: Event & { host: User } };

export const NetworkInvite = ({ event }: Props) => {
  const [search, setSearch] = useState("");
  const session = useSession();
  const networkInviteMutation = api.events.networkInvite.useMutation();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      friends: [],
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

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast.success("saldjlkasjldkj " + JSON.stringify(data, null, 2));

    networkInviteMutation.mutate(
      {
        publicId: event.publicId,
        friendsUserIds: data.friends,
        inviterName: session.data?.user.name ?? undefined,
      },
      { onSuccess: (res) => toast.success("Invites sent: " + res.invites) },
    );

    // toast.success({
    //   title: "You submitted the following values:",
    //   description: (
    //     <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
    //       <code className="text-white">{JSON.stringify(data, null, 2)}</code>
    //     </pre>
    //   ),
    // });
  };

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
          <div className="flex-1 overflow-scroll p-1">
            <FormField
              control={form.control}
              name="friends"
              render={() => (
                <FormItem>
                  {networkQuery.data
                    ?.filter(
                      (f) =>
                        f.name
                          .toLocaleLowerCase()
                          .includes(search.toLocaleLowerCase()) ||
                        f.events.some((e) =>
                          e.title
                            .toLocaleLowerCase()
                            .includes(search.toLocaleLowerCase()),
                        ),
                    )
                    .map((friend) => (
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
          <Button
            variant="outline"
            className="w-full"
            type="submit"
            disabled={form.watch("friends").length === 0}
          >
            Send invites
          </Button>
        </form>
      </Form>
    </div>
  );
};

type NetworkFriendProps = {
  friend: Friend;
  form: UseFormReturn<z.infer<typeof FormSchema>>;
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
            className="flex flex-row items-start space-x-3"
          >
            <FormLabel
              className={cn(
                "flex w-full flex-row items-center justify-between rounded py-1",
                !attending && "hover:ring",
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
