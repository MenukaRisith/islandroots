export type ClientEnv = {
  PUBLIC_API_BASE_URL: string;
};

export function getClientEnv(): ClientEnv {
  if (typeof window === "undefined") {
    throw new Error("[env.client] getClientEnv() called on the server.");
  }

  if (!window.ENV) {
    throw new Error(
      "[env.client] window.ENV is not defined. Make sure root loader exposes it."
    );
  }

  const { PUBLIC_API_BASE_URL } = window.ENV;

  if (!PUBLIC_API_BASE_URL) {
    throw new Error(
      "[env.client] Missing PUBLIC_API_BASE_URL in window.ENV. Check your root loader."
    );
  }

  return {
    PUBLIC_API_BASE_URL,
  };
}

declare global {
  interface Window {
    ENV?: Partial<ClientEnv> & Record<string, unknown>;
  }
}

export {};
