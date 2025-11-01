import { requireAuth } from "@/lib/auth-utils";
import { caller } from "./trpc/server";

export default async function Home() {
  await requireAuth()
  const usr = await caller.getUsers()
  console.log(usr)
  // console.log(usr)
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        {JSON.stringify(usr)}
    </div>
  );
}
