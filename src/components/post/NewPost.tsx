import { useSession } from "next-auth/react";
import { useZodForm } from "../../utils/zod";
import { api } from "../../utils/api";
import { postSchema, type PostSchemaType } from "../../utils/formValidation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

type NewPostProps = { eventId: number };

const NewPost = (props: NewPostProps) => {
  const { eventId } = props;
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: session } = useSession();
  const utils = api.useUtils();
  const postMutation = api.posts.post.useMutation();

  const form = useZodForm({
    schema: postSchema,
  });

  const handleSubmit = (values: PostSchemaType) => {
    if (!session?.user?.id) {
      return;
    }

    postMutation.mutate(
      {
        ...values,
        authorId: session.user.id,
        eventId: eventId,
      },
      {
        onSuccess: () => {
          form.reset();
          void utils.posts.posts.invalidate({ eventId: eventId });
          setDialogOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Button asChild>
        <DialogTrigger>Add a Post</DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a Post</DialogTitle>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">
                {!postMutation.isLoading ? "Post" : "Loading..."}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewPost;
