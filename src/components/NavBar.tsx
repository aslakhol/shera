import Link from "next/link";
import { Button } from "./ui/button";
import { AuthButton } from "./AuthButton";

const NavBar = () => {
  return (
    <div className="flex w-full items-center justify-between p-1">
      <Button asChild variant="ghost" className="text-lg">
        <Link href="/home">Shera</Link>
      </Button>
      <AuthButton />
    </div>
  );
};

export default NavBar;
