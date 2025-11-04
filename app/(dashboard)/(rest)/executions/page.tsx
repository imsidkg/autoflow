import { requireAuth } from '@/lib/auth-utils'
import React from 'react'

type Props = {}

const page = async(props: Props) => {
await  requireAuth()
  return (
    <div>Executions</div>
  )
}

export default page