import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

export const OAuthAccountNotLinked = () => {
  return (
    <div className="text-left">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="pb-2">
          You already have an account for that email, and it&apos;s not linked
          to Google.
        </AlertDescription>

        <AlertDescription>
          Sign in with email and link your account from the profile settings.
        </AlertDescription>
      </Alert>
    </div>
  );
};
