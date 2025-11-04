"use client";
import { requireAuth } from "@/lib/auth-utils";
import { useTRPC } from "./trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
export default  function Home() {
  const trpc = useTRPC()
  const testAi = useMutation(trpc.testAi.mutationOptions())
  // console.log(usr)
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Button  onClick = {() => testAi.mutate()}>test ai</Button>
    </div>
  );
}
