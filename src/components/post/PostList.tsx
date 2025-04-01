import { type Event, type Post as PostType, type User } from "@prisma/client";
import { api } from "../../utils/api";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Crown, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { Loading } from "../Loading";
import { useState } from "react";
import { WrapLinks } from "../WrapLinks";
import { type EventWithHosts } from "../../utils/types";

type PostListProps = { publicId: string };

const PostList = ({ publicId }: PostListProps) => {
  const { data: posts, isSuccess } = api.posts.posts.useQuery({ publicId });

  if (!isSuccess) {
    return <></>;
  }

  return (
    <>
      {posts.map((post) => (
        <Post key={post.postId} post={post} />
      ))}
    </>
  );
};

export default PostList;

type PostProps = {
  post: PostType & { author: User; event: EventWithHosts };
};

export const Post = (props: PostProps) => {
  const { post } = props;
  const { data: session } = useSession();

  const userIsHost = post.event.hosts.some((h) => h.id === session?.user.id);
  const canDeletePost = session?.user.id === post.authorId || userIsHost;

  const authorIsHost = post.event.hosts.some((h) => h.id === post.authorId);

  return (
    <div key={post.postId} className="w-full rounded border p-4">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <span className="flex flex-row items-center gap-1 font-bold">
            {authorIsHost && <Crown size={16} />}
            {post.author.name ?? post.author.email ?? "Anonymous"}
          </span>
          <span className="text-sm italic">
            {post.createdAt.toLocaleString("en-GB", {
              month: "short",
              day: "numeric",
              minute: "numeric",
              hour: "numeric",
            })}
          </span>
        </div>
        {canDeletePost && <ConfirmDelete post={post} />}
      </div>

      <p className="whitespace-pre-wrap break-words py-2">
        <WrapLinks text={post.message} />
      </p>
    </div>
  );
};

type ConfirmDeleteProps = { post: PostType & { author: User; event: Event } };

const ConfirmDelete = ({ post }: ConfirmDeleteProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const utils = api.useUtils();
  const deletePostMutation = api.posts.deletePost.useMutation({
    onSuccess: () => {
      setDialogOpen(false);
      return utils.posts.posts.invalidate({ publicId: post.event.publicId });
    },
  });

  const deletePost = () => {
    deletePostMutation.mutate({ postId: post.postId });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <Button asChild variant={"ghost"}>
        <DialogTrigger>
          <Trash />
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete post?
          </DialogDescription>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={deletePost}
              disabled={deletePostMutation.isLoading}
            >
              {!deletePostMutation.isLoading ? "Delete" : <Loading />}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
