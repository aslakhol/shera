import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LinkInvite } from "./LinkInvite";
import { EmailInvite } from "./EmailInvite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { NetworkInvite } from "./NetworkInvite";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NetworkInviteFormSchema } from "./utils";
import { type z } from "zod";
import { type EventWithHosts } from "../../utils/types";

type InviteProps = {
  event: EventWithHosts;
};

const Invite = (props: InviteProps) => {
  const { event } = props;
  const [emails, setEmails] = useState<string[]>([]);

  const networkInviteForm = useForm<z.infer<typeof NetworkInviteFormSchema>>({
    resolver: zodResolver(NetworkInviteFormSchema),
    defaultValues: {
      friends: [],
    },
  });

  return (
    <>
      <Dialog>
        <Button asChild variant="outline">
          <DialogTrigger>Invite</DialogTrigger>
        </Button>
        <DialogContent className="flex h-[50vh] flex-col">
          <DialogHeader>
            <DialogTitle className="text-primary">Invite</DialogTitle>
          </DialogHeader>
          <Tabs
            defaultValue="network"
            className="flex flex-1 flex-col overflow-auto"
          >
            <TabsList className="mb-2 w-full">
              <TabsTrigger value="network" className="flex-grow">
                Network
              </TabsTrigger>
              <TabsTrigger value="link" className="flex-grow">
                Link
              </TabsTrigger>
              <TabsTrigger value="email" className="flex-grow">
                Email
              </TabsTrigger>
            </TabsList>
            <TabsContent
              asChild
              value="network"
              className="flex-1 overflow-auto "
            >
              <NetworkInvite event={event} form={networkInviteForm} />
            </TabsContent>
            <TabsContent asChild value="link" className="h-full">
              <LinkInvite event={event} />
            </TabsContent>
            <TabsContent asChild value="email" className="h-full">
              <EmailInvite
                event={event}
                emails={emails}
                setEmails={setEmails}
              />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Invite;
