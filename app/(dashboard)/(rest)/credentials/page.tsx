import { credentialsParams } from '@/features/credentials/params'
import { credentialsParamsLoader } from '@/features/credentials/server/params-loader'
import { prefetchCredential, prefetchCredentials } from '@/features/credentials/server/prefetch'
import { requireAuth } from '@/lib/auth-utils'
import { HydrateClient } from '@/trpc/server'
import { SearchParams } from 'nuqs'
import React, { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

type Props = {
  searchParams : Promise<SearchParams>
}

const page = async({searchParams}: Props) => {

  const params = await credentialsParamsLoader(searchParams);
  prefetchCredentials(params)
  await requireAuth()
  return (
     <CredentialsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<CredentialError />}>
          <Suspense fallback={<CredentialLoading />}>
            <CredentialList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialsContainer>
  )
}