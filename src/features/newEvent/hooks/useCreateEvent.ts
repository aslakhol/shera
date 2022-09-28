import { trpc } from "../../../utils/trpc";

export const useCreateEvent = () => {
  const ctx = trpc.useContext();

  const mutation = trpc.useMutation(["events.create-event"], {
    onSuccess: async () => {
      ctx.invalidateQueries("events.events");
    },
  });

  return mutation;
};
