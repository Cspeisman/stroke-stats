import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { defineConfig } from "auth-astro";

const getBaseUrl = () => {
  // For production with custom domain
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // For Vercel deployments (preview or production)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Fallback for local development
  return "http://localhost:4321";
};

export default defineConfig({
  providers: [
    Google({
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        // Use the full URL for the auth callback
        const baseUrl = getBaseUrl();
        await fetch(`${baseUrl}/api/auth-callback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: user.email }),
        });
      }
      return true;
    },
  },
});
