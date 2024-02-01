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

type Props = {
  user: Session["user"];
};

export const ProfileForm = ({ user }: Props) => {
  const updateProfileMutation = api.users.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated");
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
      image: user.image ?? "",
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
              <FormDescription>
                Your default name when attending events.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile picture</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Link to your profile picture.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};