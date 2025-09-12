import { Colors } from "./colors";

export const formatError = (message: string) => {
    const errorMsg = `${Colors.red}❌ ERROR: ${message}${Colors.reset}\n`
    console.error(errorMsg);

    process.exit(1);
};