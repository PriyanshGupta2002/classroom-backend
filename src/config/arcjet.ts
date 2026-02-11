import arcjet, { shield, detectBot, slidingWindow } from "@arcjet/node";

if (!process.env.ARCJET_KEY && process.env.NODE_ENV !== "test") {
  throw new Error("Arcjet env key is required");
}
export const aj = arcjet({
  // Get your site key from https://app.arcjet.com and set it as an environment
  // variable rather than hard coding.
  key: process.env.ARCJET_KEY!,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    shield({ mode: "LIVE" }),
    // Create a bot detection rule
    detectBot({
      mode: "LIVE", // Blocks requests. Use "DRY_RUN" to log only
      // Block all bots except the following
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
        "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
    slidingWindow({
      mode: "LIVE",
      interval: "2s",
      max: 5,
    }),
  ],
});
