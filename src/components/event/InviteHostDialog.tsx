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

type InviteHostDialogProps = {
  event: EventWithHosts;
};

export const InviteHostDialog = ({ event }: InviteHostDialogProps) => {
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
            <NetworkInviteHost event={event} />
          </TabsContent>
          <TabsContent asChild value="email" className="flex-1 overflow-auto">
            <EmailInviteHost event={event} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
