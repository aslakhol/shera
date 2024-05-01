import { Toaster } from "sonner";
import NavBar from "./NavBar";
import Footer from "./footer/Footer";

type Props = { children: React.ReactNode };

export const MainLayout = ({ children }: Props) => {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center">
        <NavBar />
        <div className="md:w-[640px]">{children}</div>
        <Toaster />
      </div>
      <Footer />
    </>
  );
};
