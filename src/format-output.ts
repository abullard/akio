import { Colors } from "./colors";
import { emojiWithSpace } from "./emoji";

export const formatError = (message: string) => {
  const errorMsg = `${emojiWithSpace(.ERROR)}${Colors.red}ERROR: ${message}${Colors.reset}\n`;
    console.error(errorMsg);

    process.exit(1);
};
