"use client";

import type {
  Credential,
  CredentialType,
} from "@/features/credentials/lib/types";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import EntityHeader, {
  EmptyView,
  EntitiyContainer,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
  LoadingView,
} from "@/components/entity-components";
import { useCredentialParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";

export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialParams();

  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search credentials"
    />
  );
};

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();

  return (
    <EntityList
      items={credentials.data.items}
      getKey={(credential) => credential.id}
      renderItem={(credential) => <CredentialItem data={credential} />}
      emptyView={<CredentialsEmpty />}
    />
  );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => (
  <EntityHeader
    title="Credentials"
    description="Create and manage your credentials"
    newButtonHref="/credentials/new"
    newButtonLabel="New credential"
    disabled={disabled}
  />
);

export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialParams();

  return (
    <EntityPagination
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPages}
      page={credentials.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const CredentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <EntitiyContainer
    header={<CredentialsHeader />}
    search={<CredentialsSearch />}
    pagination={<CredentialsPagination />}
  >
    {children}
  </EntitiyContainer>
);

export const CredentialsLoading = () => (
  <LoadingView message="Loading credentials..." />
);

export const CredentialsError = () => (
  <ErrorView message="Error loading credentials" />
);

export const CredentialsEmpty = () => {
  const router = useRouter();

  return (
    <EmptyView
      onNew={() => router.push(`/credentials/new`)}
      message="No matches for search, create new credentials"
    />
  );
};

// Use plain string keys; no Prisma enum import.
const credentialLogos: Record<CredentialType, string> = {
  OPENAI: "/logos/openai.svg",
  ANTHROPIC: "/logos/anthropic.svg",
  GEMINI: "/logos/gemini.svg",
};

export const CredentialItem = ({ data }: { data: Credential }) => {
  const removeCredential = useRemoveCredential();

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };

  const logo = credentialLogos[data.type] || "/logos/openai.svg";

  const createdAt =
    data.createdAt instanceof Date ? data.createdAt : new Date(data.createdAt);
  const updatedAt =
    data.updatedAt instanceof Date ? data.updatedAt : new Date(data.updatedAt);

  return (
    <EntityItem
      href={`/credentials/${data.id}`} // ← guessing this is what you want, not /workflows
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(updatedAt, { addSuffix: true })} &bull;{" "}
          Created {formatDistanceToNow(createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image src={logo} alt={data.type} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};
