import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { type EventWithHosts } from "../../utils/types";
import { NetworkInviteHost } from "./NetworkInviteHost";
import { EmailInviteHost } from "./EmailInviteHost";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const networkInviteHostSchema = z.object({
  selectedUserIds: z.array(z.string()),
});
export type NetworkInviteHostFormValues = z.infer<
  typeof networkInviteHostSchema
>;

type InviteHostDialogProps = {
  event: EventWithHosts;
};

export const InviteHostDialog = ({ event }: InviteHostDialogProps) => {
  const [emails, setEmails] = useState<string[]>([]);

  const networkInviteHostForm = useForm<NetworkInviteHostFormValues>({
    resolver: zodResolver(networkInviteHostSchema),
    defaultValues: {
      selectedUserIds: [],
    },
  });

  return (
    <Dialog>
      <Button size="sm" asChild>
        <DialogTrigger>Invite</DialogTrigger>
      </Button>
      <DialogContent className="flex h-[50vh] flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary">Invite Co-Host</DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="network"
          className="flex flex-1 flex-col overflow-auto"
        >
          <TabsList className="mb-2 w-full">
            <TabsTrigger value="network" className="flex-grow">
              Network
            </TabsTrigger>
            <TabsTrigger value="email" className="flex-grow">
              Email
            </TabsTrigger>
          </TabsList>
          <TabsContent asChild value="network" className="flex-1 overflow-auto">
            <NetworkInviteHost event={event} form={networkInviteHostForm} />
          </TabsContent>
          <TabsContent asChild value="email" className="flex-1 overflow-auto">
            <EmailInviteHost
              event={event}
              emails={emails}
              setEmails={setEmails}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
