import { headers } from "next/headers";
import { auth } from "./auth";
import { redirect } from "next/navigation";

export const requireAuth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/login");

  return session;
};

export const requireUnauth = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If the user is already authenticated, take them to the app instead of
  // bouncing to the public landing page.
  if (session) redirect("/workflows");
};
