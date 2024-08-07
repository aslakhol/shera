import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Form,
} from "./ui/form";
import { Input } from "./ui/input";
import { type Session } from "next-auth";
import { type ProfileSchemaType, profileSchema } from "../utils/formValidation";
import { api } from "../utils/api";
import { toast } from "sonner";
import { useRouter } from "next/router";

type Props = {
  user: Session["user"];
};

export const ProfileForm = ({ user }: Props) => {
  const router = useRouter();
  const updateProfileMutation = api.users.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated");
      form.reset();
      return router.reload();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email ?? "",
    },
  });

  const onSubmit = (values: ProfileSchemaType) => {
    if (!form.formState.isDirty) {
      return;
    }

    updateProfileMutation.mutate({ userId: user.id, ...values });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Smith" {...field} />
              </FormControl>
              <FormDescription>
                Your default name when attending events.
              </FormDescription>
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
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormDescription>Your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={!form.formState.isDirty || updateProfileMutation.isLoading}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
};
