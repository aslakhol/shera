import { trpc } from "../../../utils/trpc";

export const useUpdateEvent = () => {
  const ctx = trpc.useContext();

  const mutation = trpc.useMutation(["events.update-event"], {
    onSuccess: () => {
      ctx.invalidateQueries("events.events");
    },
  });

  return mutation;
};
