"use client";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

/**
 * Session Provider Wrapper
 * Wraps the app to enable NextAuth session management
 */
export default function SessionProvider({ children, session }) {
  return (
    <NextAuthSessionProvider session={session}>
      {children}
    </NextAuthSessionProvider>
  );
}
