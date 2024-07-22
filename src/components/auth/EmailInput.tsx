import React, { KeyboardEvent, useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";

interface EmailInputProps {
  onSuccess: (email: string) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const EmailInput: React.FC<EmailInputProps> = ({
  onSuccess,
  loading,
  setLoading,
}) => {
  const [email, setEmail] = useState("");

  const handleSignin = useCallback(async () => {
    setLoading(true);
    const res = await signIn("email", {
      email: email,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      if (res?.url) {
        window.location.replace(res.url);
      }
    } else {
      onSuccess(email);
    }
  }, [email, onSuccess, setLoading]);

  return (
    <form className="grid gap-2">
      <Label className="sr-only" htmlFor={"email"}>
        Email
      </Label>
      <Input
        id={"email"}
        type="email"
        name="email"
        placeholder="your@email.com"
        autoComplete="email"
        autoCapitalize="none"
        autoCorrect="off"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
        // helpText={"A one-time code will be sent to your email."}
      />

      <Button
        type={"submit"}
        // variant={"green"}
        size="lg"
        className={""}
        disabled={loading}
        onClick={handleSignin}
      >
        Sign In with Email
      </Button>
    </form>
  );
};
