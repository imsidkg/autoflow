import RegisterForm from "@/app/features/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";
import React from "react";

type Props = {};

const page = async(props: Props) => {
  await requireUnauth();
  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default page;
