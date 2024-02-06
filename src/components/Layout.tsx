import { Toaster } from "sonner";
import NavBar from "./NavBar";

type Props = { children: React.ReactNode };

export const MainLayout = ({ children }: Props) => {
  return (
    <>
      <NavBar />
      {children}
      <Toaster />
    </>
  );
};
