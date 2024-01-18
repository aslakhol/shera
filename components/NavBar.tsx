import Link from "next/link";
import { Button } from "./ui/button";
import { AuthButton } from "./AuthButton";

const NavBar = () => {
  return (
    <div className="w-100 flex items-center justify-between p-1">
      <Button asChild variant="ghost" className="text-lg">
        <Link href="/">Shera</Link>
      </Button>
      <AuthButton />
    </div>
  );
};

export default NavBar;
