import { requireAuth } from "@/lib/auth-utils"


type Props = {}

const page = async(props: Props) => {
await  requireAuth()
  return (
    <div>page</div>
  )
}

export default page