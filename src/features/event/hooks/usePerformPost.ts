import { trpc } from "../../../utils/trpc";

export const usePerformPost = () => {
  const ctx = trpc.useContext();

  const mutation = trpc.useMutation(["events.post"], {
    onSuccess: async () => {
      // ctx.invalidateQueries("events.posts");
    },
  });

  return mutation;
};
