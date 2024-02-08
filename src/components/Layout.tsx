import { Toaster } from "sonner";
import NavBar from "./NavBar";

type Props = { children: React.ReactNode };

export const MainLayout = ({ children }: Props) => {
  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      {children}
      <Toaster />
    </div>
  );
};
