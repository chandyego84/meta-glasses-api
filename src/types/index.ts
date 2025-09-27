export const NodeEnv = {
  DEVELOPMENT: "development",
  PRODUCTION: "production",
} as const;

export type NodeEnv = (typeof NodeEnv)[keyof typeof NodeEnv];

export const TTSProvider = {
  ELEVENLABS: "elevenlabs",
  OPENAI: "openai",
  MINIMAX: "minimax",
} as const;

export const Provider = {
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
  PERPLEXITY: "perplexity",
  GOOGLE: "google",
  DEEPSEEK: "deepseek",
  XAI: "xai",
} as const;

export const ExtraProvider = {
  SPOTIFY: "spotify",
} as const;

export interface SpotifyCredentials {
  clientId: string;
  clientSecret: string;
}

export type TTSProvider = (typeof TTSProvider)[keyof typeof TTSProvider];
export type Provider = (typeof Provider)[keyof typeof Provider];
export type ExtraProvider = (typeof ExtraProvider)[keyof typeof ExtraProvider];