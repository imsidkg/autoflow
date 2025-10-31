import { caller } from "./trpc/server";

export default async function Home() {
  const usr = await caller.hello()
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        {JSON.stringify(usr)}
    </div>
  );
}
