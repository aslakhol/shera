import { Toaster } from "sonner";
import NavBar from "./NavBar";
import Footer from "./footer/Footer";

import { Raleway } from "next/font/google";

const raleway = Raleway({ subsets: ["latin"], weight: ["400", "700"] });

type Props = { children: React.ReactNode };

export const MainLayout = ({ children }: Props) => {
  return (
    <>
      <div
        className={`flex min-h-screen flex-col items-center ${raleway.className}`}
      >
        <NavBar />
        <div className="w-full sm:w-[640px]">{children}</div>
        <Toaster />
      </div>
      <Footer />
    </>
  );
};

export const LandingPageLayout = ({ children }: Props) => {
  return (
    <>
      <div
        className={`flex min-h-screen flex-col items-center bg-background ${raleway.className}`}
      >
        <NavBar />
        <div className="flex w-full flex-1 justify-center">{children}</div>
        <Toaster />
      </div>
      <Footer />
    </>
  );
};

export const AdminLayout = ({ children }: Props) => {
  return (
    <>
      <div
        className={`flex min-h-screen flex-col items-center ${raleway.className}`}
      >
        <NavBar />
        <div className="w-full">{children}</div>
        <Toaster />
      </div>
      <Footer />
    </>
  );
};
