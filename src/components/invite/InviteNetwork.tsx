import { Separator } from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { EmailInvite } from "./EmailInvite";
import { LinkInvite } from "./LinkInvite";
import { type User, type Event } from "@prisma/client";
import { Label } from "../ui/label";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Checkbox } from "../ui/checkbox";

type Props = {
  event: Event & {
    host: User;
  };
};

export const InviteNetwork = ({ event }: Props) => {
  return (
    <Dialog>
      <Button asChild variant="outline">
        <DialogTrigger>Invite network</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary">Invite</DialogTitle>
        </DialogHeader>
        <Network event={event} />
      </DialogContent>
    </Dialog>
  );
};

const FormSchema = z.object({
  friends: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

type NetworkProps = { event: Event & { host: User } };

const Network = ({ event }: NetworkProps) => {
  const [search, setSearch] = useState("");
  const session = useSession();

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
    <>
      <Label htmlFor="search">Search</Label>
      <div className="flex gap-1.5">
        <Input
          type="search"
          id="search"
          value={search}
          placeholder="Name of person or event"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="friends"
            render={() => (
              <FormItem>
                {networkQuery.data
                  ?.filter((f) =>
                    f.name
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase()),
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
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
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
            className="flex flex-row items-start space-x-3 "
          >
            <FormLabel
              className={cn(
                "flex w-full flex-row items-center justify-between rounded px-3 py-1",
                !attending && "hover:ring",
              )}
            >
              <div className={cn(attending && "opacity-50")}>
                <p className="text-md font-medium">{friend.name}</p>
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
