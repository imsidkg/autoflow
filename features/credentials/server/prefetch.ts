import { prefetch, trpc } from "@/trpc/server";
import { inferInput } from "@trpc/tanstack-react-query";
type Input = inferInput<typeof trpc.credential.getMany>;

export const prefetchCredentials = (params: Input) => {
  return prefetch(trpc.credential.getMany.queryOptions(params));
};
export const prefetchCredential = (id: string) => {
  return prefetch(trpc.credential.getOne.queryOptions({ id }));
};
