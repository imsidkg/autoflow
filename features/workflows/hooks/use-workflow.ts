import { useTRPC } from "@/trpc/client";
import { trpc } from "@/trpc/server";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useSuspenseWorkflow = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
};

export const useCreateWorkflows = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  trpc.workflows.create.mutationOptions({
    onSuccess: (data) => {
      toast.success(`Workflow "${data.name}" created`);
      router.push(`/workflows/${data.id}`);
      queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions());
    },
    onError: (error) => {
      toast.error(`Failed to create workspace ${error.message}`);
    },
  });
};
