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
import { useState, useEffect } from "react";

export const AuthButton = () => {
  const session = useSession();

  const [isEmbedded, setIsEmbedded] = useState(false);

  useEffect(() => {
    const embeddedBrowser = /FBAN|FBAV|FBMS|FB_IAB|FB4A|FBAN\/Messenger/.test(
      navigator.userAgent,
    );
    setIsEmbedded(embeddedBrowser);
  }, []);

  if (session.status === "loading") {
    return <div className=" h-10 w-10  rounded-full bg-muted"></div>;
  }

  if (session.status === "unauthenticated") {
    return (
      <Button asChild variant={"ghost"} className="text-lg">
        <Link
          href={"/api/auth/signin"}
          target={isEmbedded ? "_top" : undefined}
        >
          Sign in{isEmbedded ? "." : ""}
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Link href={"/profile"} className="hover:underline">
        {session.data?.user.name ?? "Complete profile setup"}
      </Link>
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
          <SignedInContent session={session} />
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
        <Link href={"/events/new"}>
          <DropdownMenuItem>New Event</DropdownMenuItem>
        </Link>
        <Link href={"/events"}>
          <DropdownMenuItem>Events</DropdownMenuItem>
        </Link>
        <Link href="/profile">
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <Link href={"/api/auth/signout"}>
        <DropdownMenuItem>Sign out</DropdownMenuItem>
      </Link>
    </>
  );
};
