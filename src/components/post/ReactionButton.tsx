import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { Button } from "../ui/button";
import { type GroupedReactions } from "../../utils/types";

type ReactionButtonProps = {
  emoji: string;
  reactions: (GroupedReactions[string][0])[];
  postId: number;
  onReactionChange: () => void;
};

export const ReactionButton = ({ 
  emoji, 
  reactions, 
  postId, 
  onReactionChange 
}: ReactionButtonProps) => {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  
  const utils = api.useUtils();
  const addReactionMutation = api.posts.addReaction.useMutation({
    onSuccess: () => {
      setIsLoading(false);
      onReactionChange();

      void utils.posts.posts.invalidate();
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  const handleReaction = () => {
    if (!session?.user?.id || isLoading) return;
    
    setIsLoading(true);
    void addReactionMutation.mutate({
      postId,
      emoji,
      userId: session.user.id,
    });
  };

  const userHasReacted = reactions.some(
    (reaction) => reaction.userId === session?.user?.id
  );

  return (
    <Button
      variant={userHasReacted ? "default" : "outline"}
      size="sm"
      onClick={handleReaction}
      disabled={isLoading}
      className="h-8 px-2 text-sm"
    >
      <span className="mr-1">{emoji}</span>
      <span>{reactions.length}</span>
    </Button>
  );
};
