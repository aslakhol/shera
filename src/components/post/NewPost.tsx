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
import { Textarea } from "../ui/textarea";
import { Loading } from "../Loading";

type NewPostProps = { publicId: string };

const NewPost = (props: NewPostProps) => {
  const { publicId } = props;
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
        publicId: publicId,
      },
      {
        onSuccess: () => {
          form.reset();
          void utils.posts.posts.invalidate({ publicId: publicId });
          setDialogOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Button asChild variant={"outline"}>
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
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={!postMutation.isIdle}>
                {postMutation.isIdle ? "Post" : <Loading />}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewPost;
