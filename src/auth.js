import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials;
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

          console.log(`🔐 Attempting login for: ${email}`);
          console.log(`📡 Using API URL: ${apiUrl}`);

          // Call your backend API to verify credentials
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const contentType = response.headers.get("content-type");
          const isJson = contentType && contentType.includes("application/json");

          if (!isJson) {
            const text = await response.text();
            console.error("❌ Auth endpoint returned non-JSON response:", contentType);
            console.error("Response status:", response.status);
            console.error("Response body:", text.substring(0, 500));
            throw new Error(`Server returned ${response.status}: ${text.substring(0, 200)}`);
          }

          const data = await response.json();

          if (!response.ok) {
            console.error("❌ Auth failed with status:", response.status, data.message);
            throw new Error(data.message || "Authentication failed");
          }

          if (data.success && data.user) {
            console.log(`✅ Login successful for: ${email}`);
            // Return user object
            return {
              id: data.user._id,
              email: data.user.email,
              name: data.user.name,
              role: data.user.role || "customer",
            };
          }

          console.error("❌ Login failed:", data.message);
          return null;
        } catch (error) {
          console.error("❌ Auth error:", error.message);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnProfile = nextUrl.pathname.startsWith("/profile");
      const isOnOrders = nextUrl.pathname.startsWith("/orders");
      const isOnAuth = nextUrl.pathname.startsWith("/auth");

      // Redirect authenticated users away from auth pages
      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }

      // Dashboard requires admin role
      if (isOnDashboard) {
        if (!isLoggedIn) return false;
        return auth.user.role === "admin";
      }

      // Profile and orders require authentication
      if (isOnProfile || isOnOrders) {
        return isLoggedIn;
      }

      return true;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  basePath: "/api/auth",
});
