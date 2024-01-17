import Link from "next/link";
import { Button } from "./ui/button";
import { AuthButton } from "./AuthButton";

const NavBar = () => {
  // TODO Center and pad the elements nicer

  return (
    <div className="w-100 flex justify-between p-1 align-middle">
      <Button asChild variant="ghost" className="text-lg">
        <Link href="/">Shera</Link>
      </Button>
      <AuthButton />
    </div>
  );
};

export default NavBar;
