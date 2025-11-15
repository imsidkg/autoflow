export type CredentialType = "OPENAI" | "ANTHROPIC" | "GEMINI";

export interface Credential {
  id: string;
  name: string;
  type: CredentialType;
  createdAt: string | Date;
  updatedAt: string | Date;
}