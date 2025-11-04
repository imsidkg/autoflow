import { requireAuth } from "@/lib/auth-utils";
import React from "react";

interface Props {
  params: Promise<{
    workflowId: string;
  }>;
}

const page = async ({ params }: Props) => {
  await requireAuth()
  const { workflowId } = await params;
  return <div>workflowId : {workflowId}</div>;
};

export default page;
