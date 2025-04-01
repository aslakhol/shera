import {
  Dialog, // Renamed import
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
  // Add state/forms if needed for child components, similar to Invite.tsx
  // For now, just structure the dialog and tabs

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Invite</Button>
      </DialogTrigger>
      <DialogContent className="flex h-[50vh] flex-col sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Invite Co-Host</DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="network"
          className="flex flex-1 flex-col overflow-auto"
        >
          <TabsList className="mb-2 grid w-full grid-cols-2">
            {" "}
            {/* Changed from flex */}
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            {/* Link tab removed as planned */}
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
