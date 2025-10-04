import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "../../utils/api";
import { ReactionButton } from "./ReactionButton";
import { Button } from "../ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "../ui/popover";
import { Smile } from "lucide-react";

type ReactionsBarProps = {
  postId: number;
  reactions: Record<string, Array<{ 
    reactionId: string; 
    emoji: string; 
    userId: string; 
    postId: number; 
    createdAt: Date; 
    updatedAt: Date; 
    user: { 
      id: string; 
      name: string | null; 
      email: string | null; 
      emailVerified: Date | null; 
      image: string | null; 
    }; 
  }>>;
};

const COMMON_EMOJIS = ["👍", "👌", "❤️", "😂", "😮", "😢", "😡", "🎉", "👺", "👑"];

export const ReactionsBar = ({ postId, reactions }: ReactionsBarProps) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  
  const utils = api.useUtils();
  const addReactionMutation = api.posts.addReaction.useMutation({
    onSuccess: () => {
      setIsOpen(false);

      void utils.posts.posts.invalidate();
    },
  });

  const handleQuickReaction = (emoji: string) => {
    if (!session?.user?.id) return;
    
    void addReactionMutation.mutate({
      postId,
      emoji,
      userId: session.user.id,
    });
  };

  const reactionEntries = Object.entries(reactions);
  const hasReactions = reactionEntries.length > 0;

  return (
    <div className="flex items-center gap-2 mt-2">

      {hasReactions && (
        <div className="flex gap-1">
          {reactionEntries.map(([emoji, emojiReactions]) => (
            <ReactionButton
              key={emoji}
              emoji={emoji}
              reactions={emojiReactions}
              postId={postId}
              onReactionChange={() => {
                void utils.posts.posts.invalidate();
              }}
            />
          ))}
        </div>
      )}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Smile size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2" align="start">
          <div className="flex gap-1">
            {COMMON_EMOJIS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg"
                onClick={() => handleQuickReaction(emoji)}
                disabled={addReactionMutation.isLoading}
              >
                {emoji}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
