import { useSession } from "next-auth/react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { User } from "lucide-react";

export const AuthButton = () => {
  const session = useSession();

  if (session.status === "loading") {
    return <></>;
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {session.status === "authenticated" && (
        <span>
          {session.data?.user.name?.split(" ")[0] ??
            session.data?.user.email ??
            "Signed in"}
        </span>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={session?.data?.user.image ?? ""}
                alt={session?.data?.user.name ?? "user icon"}
              />
              <AvatarFallback>
                <User size={24} />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          {session.status === "authenticated" ? (
            <SignedInContent session={session} />
          ) : (
            <SignedOutContent />
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

type SignedInContentProps = { session: ReturnType<typeof useSession> };

const SignedInContent = ({ session }: SignedInContentProps) => {
  return (
    <>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">
            {session.data?.user.name ?? "No name"}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {session.data?.user.email ?? "No email"}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <Link href="/profile">
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <Link href={"/events/new"}>
          <DropdownMenuItem>New Event</DropdownMenuItem>
        </Link>
        <Link href={"/events"}>
          <DropdownMenuItem>Events</DropdownMenuItem>
        </Link>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <Link href={"/api/auth/signout"}>
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </Link>
    </>
  );
};

const SignedOutContent = () => {
  return (
    <>
      <Link href={"/api/auth/signin"}>
        <DropdownMenuItem>Sign In</DropdownMenuItem>
      </Link>
    </>
  );
};
