import { loadAppConfig } from "./app";
import { loadAuthConfig } from "./auth";

const loadConfigs = () => {
  const app = loadAppConfig();
  const auth = loadAuthConfig();

  return {
    app,
    auth
  };
};

export { loadConfigs };
