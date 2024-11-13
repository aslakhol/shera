import sgEmail from "@sendgrid/mail";
import { env } from "../env";

sgEmail.setApiKey(env.SENDGRID_API_KEY);

const emailClient = {
  send: async (...args: Parameters<typeof sgEmail.send>) => {
    if (env.SENDGRID_API_KEY === "local") {
      console.log(`----------- <ConsoleEmail> -----------`);
      console.log(JSON.stringify(args[0], undefined, 2));
      console.log(`----------- </ConsoleEmail> -----------`);
      return;
    }
    return sgEmail.send(...args);
  },
  sendMultiple: async (...args: Parameters<typeof sgEmail.sendMultiple>) => {
    if (env.SENDGRID_API_KEY === "local") {
      console.log(`----------- <ConsoleEmail> -----------`);
      console.log(JSON.stringify(args[0], undefined, 2));
      console.log(`----------- </ConsoleEmail> -----------`);
      return;
    }
    return sgEmail.sendMultiple(...args);
  },
};

export { emailClient };
