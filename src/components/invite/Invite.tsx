import { type Event, type User } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { LinkInvite } from "./LinkInvite";
import { EmailInvite } from "./EmailInvite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { NetworkInvite } from "./NetworkInvite";

type InviteProps = {
  event: Event & {
    host: User;
  };
};

const Invite = (props: InviteProps) => {
  const { event } = props;

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
          <Tabs defaultValue="network" className="flex flex-grow flex-col">
            <TabsList className="w-full">
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
            <div className="flex-grow">
              <TabsContent value="network" className="h-full">
                <NetworkInvite event={event} />
              </TabsContent>
              <TabsContent value="link" className="h-full">
                <LinkInvite event={event} />
              </TabsContent>
              <TabsContent value="email" className="h-full">
                <EmailInvite event={event} />
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Invite;
