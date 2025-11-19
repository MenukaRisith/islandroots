
export type ServerEnv = {
  API_BASE_URL: string;
  NODE_ENV: "development" | "test" | "production";
};

export function getServerEnv(): ServerEnv {
  const { API_BASE_URL, NODE_ENV } = process.env;

  if (!API_BASE_URL) {
    throw new Error(
      "[env.server] Missing API_BASE_URL. Please set it in your environment."
    );
  }

  const nodeEnv = (NODE_ENV ?? "development") as ServerEnv["NODE_ENV"];

  if (!["development", "test", "production"].includes(nodeEnv)) {
    throw new Error(
      `[env.server] Invalid NODE_ENV value: ${NODE_ENV}. Expected "development", "test" or "production".`
    );
  }

  return {
    API_BASE_URL,
    NODE_ENV: nodeEnv,
  };
}
