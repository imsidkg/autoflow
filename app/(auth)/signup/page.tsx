import RegisterForm from "@/app/features/auth/components/register-form";
import { requireUnauth } from "@/lib/auth-utils";

type Props = {};

const page = async (props: Props) => {
  await requireUnauth();
  return (
    <div>
      <RegisterForm />
    </div>
  );
};

export default page;
