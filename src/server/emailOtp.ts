import EmailProvider from "next-auth/providers/email";
import { env } from "../env";
import { emailClient } from "./email";

const generateOtpCode = async () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const EmailOtpProvider = EmailProvider({
  server: {
    service: "SendGrid",
    auth: { user: "apikey", pass: env.SENDGRID_API_KEY },
  },
  from: env.EMAIL_FROM,
  maxAge: 5 * 60,
  generateVerificationToken: generateOtpCode,
  sendVerificationRequest: async ({
    identifier: email,
    url,
    token,
    provider: { from },
  }) => {
    const baseUrl = new URL(url).origin;
    const host = baseUrl.replace(/^https?:\/\//, "");

    await emailClient.send({
      to: "no-reply@shera.no",
      bcc: email,
      from: from,
      subject: `Authentication code: ${token}`,
      text: text({ host, token }),
      html: html({ host, token }),
    });
  },
});

function text({ host, token }: { host: string; token: string }) {
  return `Use ${token} to sign in to ${host}`;
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html({
  theme,
  token,
  host,
}: {
  theme?: { brandColor: string; buttonText: string };
  token: string;
  host: string;
}) {
  const escapedHost = host.replace(/\./g, "&#8203;.");

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const brandColor = theme?.brandColor || "#4470b8";
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const buttonText = theme?.buttonText || "#fff";

  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText,
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Use code below to sign in to <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><span
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">${token}</span></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}
