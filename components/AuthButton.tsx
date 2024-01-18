import { signIn, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
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
    <div className="dropdown dropdown-end">
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
            <SignedOutContent session={session} />
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
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>
        <Link href={"/events/new"}>
          <DropdownMenuItem>
            New Event
            <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>
        <Link href={"/events"}>
          <DropdownMenuItem>
            Events
            <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <Link href={"/api/auth/signout"}>
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </Link>
    </>
  );
};

type SignedOutContentContentProps = { session: ReturnType<typeof useSession> };

const SignedOutContent = ({ session }: SignedOutContentContentProps) => {
  return (
    <>
      <Link href={"/api/auth/signin"}>
        <DropdownMenuItem
        // onClick={() =>
        //   signIn("email", {
        //     email: "aslakhol@gmail.com",
        //     callbackUrl: "/foobar",
        //   })
        // }
        >
          Log In
          <DropdownMenuShortcut>⇧⌘L</DropdownMenuShortcut>
        </DropdownMenuItem>
      </Link>
    </>
  );
};
