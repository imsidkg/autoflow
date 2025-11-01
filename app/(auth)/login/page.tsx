import LoginForm from "@/app/features/components/login-form";
import { requireUnauth } from "@/lib/auth-utils";
import React from "react";

type Props = {};

const page = async (props: Props) => {
  await requireUnauth();
  return (
    <div>
      Login
      <LoginForm />
    </div>
  );
};

export default page;
