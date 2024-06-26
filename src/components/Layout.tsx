import { Toaster } from "sonner";
import NavBar from "./NavBar";
import Footer from "./footer/Footer";

type Props = { children: React.ReactNode };

export const MainLayout = ({ children }: Props) => {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center">
        <NavBar />
        <div className="w-full sm:w-[640px]">{children}</div>
        <Toaster />
      </div>
      <Footer />
    </>
  );
};

export const AdminLayout = ({ children }: Props) => {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center">
        <NavBar />
        <div className="w-full">{children}</div>
        <Toaster />
      </div>
      <Footer />
    </>
  );
};
