import { trpc } from "../../../utils/trpc";

export const usePerformPost = () => {
  const ctx = trpc.useContext();

  const mutation = trpc.useMutation(["posts.post"], {
    onSuccess: async () => {
      ctx.invalidateQueries("posts.posts");
    },
  });

  return mutation;
};
