import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from "typeorm";
import type { Workflow } from "./Workflow.js"; // Add 'type'
import type { User } from "./User.js"; // Add 'type'

import type {
  WorkflowNode,
  WorkflowConnection,
  WorkflowExecuteMode,
} from "../types/workflow"; // Assuming these are now in types/workflow.ts

// Types and Interfaces from Execution.ts
export type ExecutionStatus =
  | "new"
  | "running"
  | "success"
  | "error"
  | "waiting"
  | "canceled";

export interface ExecutionData {
  startData: {
    destinationNode?: string;
    runNodeFilter?: string[];
  };
  resultData: {
    runData: Record<string, any[]>;
    pinData?: Record<string, any[]>;
    lastNodeExecuted?: string;
    error?: {
      message: string;
      stack?: string;
      node?: string;
    };
  };
  executionData?: {
    contextData: Record<string, any>;
    nodeExecutionStack: any[];
    metadata: Record<string, any>;
    waitingExecution: Record<string, any>;
    waitingExecutionSource: any;
  };
}

// Entity: Execution
@Entity("executions")
@Index(["workflowId", "status"])
@Index(["userId", "startedAt"])
export class Execution {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  workflowId!: string;

  @Column({ nullable: true })
  userId!: string;

  @Column({
    type: "enum",
    enum: ["new", "running", "success", "error", "waiting", "canceled"],
    default: "new",
  })
  status!: ExecutionStatus;

  @Column({ type: "jsonb" })
  workflowData!: {
    id: string;
    name: string;
    nodes: WorkflowNode[];
    connections: WorkflowConnection[];
    settings: Record<string, any>;
    staticData: Record<string, any>;
  };

  @Column({ type: "jsonb" })
  data!: ExecutionData;

  @Column({ type: "jsonb", nullable: true })
  mode!: WorkflowExecuteMode;

  @Column({ nullable: true })
  retryOf!: string;

  @Column({ default: 0 })
  retryAttempts!: number;

  @CreateDateColumn()
  startedAt!: Date;

  @Column({ nullable: true })
  stoppedAt!: Date;

  @Column({ nullable: true })
  finishedAt!: Date;

  @ManyToOne("Workflow", (workflow: Workflow) => workflow.executions)
  @JoinColumn({ name: "workflowId" })
  workflow!: Workflow;

  @ManyToOne("User", (user: User) => user.executions)
  @JoinColumn({ name: "userId" })
  user!: User;
}
