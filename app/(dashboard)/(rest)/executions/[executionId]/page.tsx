import { requireAuth } from "@/lib/auth-utils";
import React from "react";

type Props = {
  params: Promise<{
    executionId: string;
  }>;
};

const page = async ({ params }: Props) => {
await  requireAuth();
  const { executionId } = await params;
  return <div>execution : {executionId}</div>;
};

export default page;
