import { Github, Twitter } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <>
      <footer className="flex justify-between gap-8 bg-card p-10 text-card-foreground">
        <div className="flex gap-4 font-medium">
          <Link className="hover:underline" href={"/privacy-policy"}>
            Privacy Policy
          </Link>

          <Link
            className="hover:underline"
            target="_blank"
            href="mailto:aslak@shera.no?subject=Contact from Shera.no"
          >
            Contact
          </Link>
        </div>
        <div className="flex gap-4">
          <Link href={"https://shera.beehiiv.com/"} target="_blank">
            Newsletter
          </Link>
          <Link href="https://twitter.com/EchoEsq" target="_blank">
            <Twitter />
          </Link>
          <Link href="https://github.com/aslakhol/shera" target="_blank">
            <Github />
          </Link>
        </div>
      </footer>
    </>
  );
};

export default Footer;
