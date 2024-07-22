import React, { useState } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { VerificationStep } from "../../components/auth/VerificationStep";
import { EmailInput } from "../../components/auth/EmailInput";
import { getProviders, getSession, signIn } from "next-auth/react";
import { cn } from "../../utils/cn";
import { Loading } from "../../components/Loading";
import { Button } from "../../components/ui/button";
import { OAuthAccountNotLinked } from "../../components/auth/AuthErrors";
import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "../../components/ui/alert";
import GoogleIcon from "../../components/auth/GoogleIcon";
import Router from "next/router";

interface Provider {
  id: string;
  name: string;
  type: string;
  [k: string]: string;
}

interface SigninPageProps {
  providers: Array<Provider>;
  csrfToken: string;
  callbackUrl?: string;
}

const SigninPage: NextPage<SigninPageProps> = (props) => {
  const { query } = useRouter();
  const { error } = query;
  const callbackUrl = props.callbackUrl ?? "/home";

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [email, setEmail] = useState("");
  const [showVerificationStep, setShowVerificationStep] = useState(false);

  const googleProvider = Object.values(props.providers).find(
    (provider) => provider.id === "google",
  );

  if (showVerificationStep) {
    return (
      <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[350px] sm:pt-10">
        <VerificationStep email={email} callbackUrl={callbackUrl} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:mt-20 sm:w-[350px]">
      <div className="flex flex-col space-y-2 text-center">
        <h1 className="pb-2 text-2xl font-semibold tracking-tight">Sign In</h1>
        {error === "OAuthAccountNotLinked" && <OAuthAccountNotLinked />}
        {error && error !== "OAuthAccountNotLinked" && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="pb-2">
              There has been an error, please try again or contact the developer
              and send him the URL you are currently on.
            </AlertDescription>
          </Alert>
        )}
        <p className="text-sm text-muted-foreground">
          Enter your email below to receive a one-time code
        </p>
      </div>
      <div className={cn("grid gap-6")}>
        <EmailInput
          onSuccess={(email) => {
            setEmail(email);
            setShowVerificationStep(true);
          }}
          loading={isLoading}
          setLoading={setIsLoading}
        />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        {googleProvider && (
          <Button
            variant="outline"
            type="button"
            disabled={isLoading}
            onClick={() => signIn(googleProvider.id)}
          >
            {isLoading ? <Loading /> : <GoogleIcon />} Google
          </Button>
        )}
      </div>
    </div>
  );
};

SigninPage.getInitialProps = async (context) => {
  const { req, res } = context;
  const session = await getSession({ req });
  const providers = await getProviders();

  if (session !== null) {
    if (res) {
      res.writeHead(307, { Location: "/events" });
      res.end();
    } else {
      void Router.replace("/events");
    }

    return {
      providers,
      callbackUrl: context.query.callbackUrl,
    } as unknown as SigninPageProps;
  }

  return {
    providers,
    callbackUrl: context.query.callbackUrl,
  } as unknown as SigninPageProps;
};

export default SigninPage;
