import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "./AuthButton";

const NavBar = () => {
  return (
    <div className="flex w-full items-center justify-between p-1">
      <Link href="/home" className="p-2">
        <Image src="/shera_icon.svg" alt="Shera Logo" width={25} height={25} />
      </Link>
      <AuthButton />
    </div>
  );
};

export default NavBar;
