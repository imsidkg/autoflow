import LoginForm from "@/features/auth/components/login-form";
import { requireUnauth } from "@/lib/auth-utils";

type Props = {};

const page = async (props: Props) => {
  await requireUnauth();
  return <LoginForm />;
};

export default page;
