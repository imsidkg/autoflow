import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins : [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ],
  emailAndPassword: {
    enabled: true,
    autoSignIn:true
  },
  
});
