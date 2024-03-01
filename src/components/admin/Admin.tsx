import { toast } from "sonner";
import { api } from "../../utils/api";
import { Button } from "../ui/button";

export const Admin = () => {
  const assignPublicIdsMutation = api.events.assignPublicId.useMutation({
    onSuccess: (res) => {
      toast(
        `Id assigned to event ${res.eventId} with title ${res.title}: ${res.publicId}`,
      );
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const handleGiveIds = () => {
    assignPublicIdsMutation.mutate();
  };

  return (
    <div>
      <Button onClick={handleGiveIds}>Assign Ids</Button>
    </div>
  );
};
