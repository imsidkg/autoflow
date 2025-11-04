import { requireAuth } from "@/lib/auth-utils";
import React from "react";

interface Props {
  params: Promise<{
    credentialId: string;
  }>;
}

const page = async ({ params }: Props) => {
await  requireAuth()
  const { credentialId } = await params;
  return <div>credential : {credentialId}</div>;
};

export default page;
