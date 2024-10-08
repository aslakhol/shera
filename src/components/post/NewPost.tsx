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
import { Checkbox } from "../ui/checkbox";

type NewPostProps = { publicId: string };

const NewPost = (props: NewPostProps) => {
  const { publicId } = props;
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: session } = useSession();
  const utils = api.useUtils();
  const postMutation = api.posts.post.useMutation({
    onSuccess: () => {
      form.reset();
      setDialogOpen(false);
      return utils.posts.posts.invalidate({ publicId: publicId });
    },
  });

  const form = useZodForm({
    schema: postSchema,
    defaultValues: {
      notify: true,
      message: "",
    },
  });

  const handleSubmit = (values: PostSchemaType) => {
    if (!session?.user?.id) {
      return;
    }

    postMutation.mutate({
      ...values,
      authorId: session.user.id,
      publicId: publicId,
    });
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
              className="space-y-6"
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

              <FormField
                control={form.control}
                name="notify"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Notify attendees</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={postMutation.isLoading}>
                {!postMutation.isLoading ? "Post" : <Loading />}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default NewPost;
