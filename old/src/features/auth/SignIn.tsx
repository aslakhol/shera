import { BuiltInProviderType } from "next-auth/providers";
import { ClientSafeProvider, LiteralUnion, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import GitHubIcon from "./GitHubIcon";
import GoogleIcon from "./GoogleIcon";

type SignInProps = {
  providers: Record<
    LiteralUnion<BuiltInProviderType, string>,
    ClientSafeProvider
  >;
  callbackUrl?: string;
};

const SignIn = (props: SignInProps) => {
  const { providers, callbackUrl = "/" } = props;
  const [email, setEmail] = useState("");
  const { query } = useRouter();

  const handleSignIn = (providerId: string, email?: string) => {
    signIn(providerId, { email: email, callbackUrl: callbackUrl });
  };

  return (
    <div className="min-h-screen-content mx-auto flex flex-col items-center justify-center md:w-1/2 ">
      {query.error === "OAuthAccountNotLinked" && (
        <div className={`toast toast-end fixed bottom-2`}>
          <div className="alert alert-error">
            <span>
              To confirm your identity, sign in with the same provider you used
              originally.
            </span>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-4 rounded border p-8">
        <button
          className="btn btn-outline"
          onClick={() => handleSignIn(providers.google.id)}
        >
          <GoogleIcon />
          Sign in with Google
        </button>
        <button
          className="btn btn-outline flex items-center justify-center gap-1"
          onClick={() => handleSignIn(providers.github.id)}
        >
          <div className="px-4">
            <GitHubIcon />
          </div>
          Sign in with GitHub
        </button>

        <div className="form-control w-full">
          <label className="label" htmlFor={"email"}>
            <span className="label-text">Email</span>
          </label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id={"email"}
            type="text"
            className={`input input-bordered w-full max-w-xs`}
          />
        </div>
        <button
          className="btn"
          type="submit"
          onClick={() => handleSignIn(providers.email.id, email)}
        >
          Sign in with Email
        </button>
      </div>
    </div>
  );
};

export default SignIn;
