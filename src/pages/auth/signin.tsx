import React, { useState } from "react";
import { type NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { VerificationStep } from "../../components/auth/VerificationStep";
import { EmailInput } from "../../components/auth/EmailInput";
import { getProviders, getSession } from "next-auth/react";
import { cn } from "../../utils/cn";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Loading } from "../../components/Loading";
import { Button } from "../../components/ui/button";

interface Provider {
  id: string;
  name: string;
  type: string;
  [k: string]: string;
}

interface SigninPageProps {
  isLoggedIn: boolean;
  providers: Array<Provider>;
  csrfToken: string;
}

const SigninPage: NextPage<SigninPageProps> = ({ providers, isLoggedIn }) => {
  const { query } = useRouter();
  const { error } = query;
  const callbackUrl = "https://your-website.com";

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const [email, setEmail] = useState("");
  const [showVerificationStep, setShowVerificationStep] = useState(false);
  const emailProvider = Object.values(providers).filter(
    (provider) => provider.type === "email",
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
        <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
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
        <Button variant="outline" type="button" disabled={isLoading}>
          {isLoading ? <Loading /> : "(G)"} Google
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      <div>
        <h2>Sign in with your email</h2>

        {emailProvider.map((provider) => (
          <EmailInput
            key={provider.id}
            onSuccess={(email) => {
              setEmail(email);
              setShowVerificationStep(true);
            }}
          />
        ))}
      </div>

      {/* {credentials} */}
    </div>
  );
};

SigninPage.getInitialProps = async (context) => {
  const { req } = context;
  const session = await getSession({ req });
  return {
    isLoggedIn: session !== null,
    providers: await getProviders(),
  } as unknown as SigninPageProps;
};

export default SigninPage;
