import React, { useCallback, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";
import { Label } from "~/components/ui/label";

interface VerificationStepProps {
  email: string;
  callbackUrl?: string;
  className?: string;
}

/**
 * User has inserted the email and can put the verification code
 */
export const VerificationStep: React.FC<VerificationStepProps> = ({
  email,
  callbackUrl,
  className,
}) => {
  const [code, setCode] = useState("");

  const onReady = useCallback(() => {
    window.location.href = `/api/auth/callback/email?email=${encodeURIComponent(
      email,
    )}&token=${code}${callbackUrl ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`;
  }, [callbackUrl, code, email]);

  return (
    <div className={className}>
      <Label>One time code</Label>
      <div className={"my-1"}>
        <InputOTP
          maxLength={4}
          onComplete={onReady}
          onChange={setCode}
          autoFocus
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <div className="text-center text-sm">Input the code from your email</div>
    </div>
  );
};
