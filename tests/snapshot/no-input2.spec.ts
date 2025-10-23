import { describe, it, expect } from "vitest";
import { spawnWrapper } from "../utils/test-utils";

describe('no-input2.spec.ts', () => {
      it('should skip prompting user for input, --no-input', async () => {
          const cmd = "pnpm";
          const args = ['akio', '--no-input'];
  
          const { stdout } = await spawnWrapper(cmd, args);
  
          expect(stdout).toMatchSnapshot();
      });
});
