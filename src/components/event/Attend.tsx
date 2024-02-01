import { useState } from "react";
import { api } from "../../utils/api";
import {
  type AttendEventSchemaType,
  attendEventSchema,
} from "../../utils/formValidation";
import { useZodForm } from "../../utils/zod";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type Props = { eventId: number };

export const Attend = ({ eventId }: Props) => {
  const utils = api.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);

  const attendMutation = api.events.attend.useMutation();

  const form = useZodForm({
    schema: attendEventSchema,
  });

  const handleSubmit = (values: AttendEventSchemaType) => {
    attendMutation.mutate(
      {
        ...values,
        eventId,
      },
      {
        onSuccess: () => {
          form.reset();
          void utils.events.attendees.invalidate({ eventId });
          setDialogOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Button asChild>
        <DialogTrigger>Attend?</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attendees:</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
