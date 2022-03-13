import { session as expressSession } from "../src/index";

export const mochaHooks = (): Mocha.RootHookObject => {
  return {
    afterAll() {
      expressSession.close();
    },
  };
};
