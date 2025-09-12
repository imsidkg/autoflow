import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import type { Workflow } from './Workflow.js'; // Add 'type'
import type { WorkflowNode, WorkflowConnection } from '../types/workflow'; // Assuming these are now in types/workflow.ts

// Entity: WorkflowHistory
@Entity('workflow_history')
@Index(['workflowId', 'createdAt'])
export class WorkflowHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  workflowId!: string;

  @Column()
  versionId!: string;

  @Column({ type: 'jsonb' })
  nodes!: WorkflowNode[];

  @Column({ type: 'jsonb' })
  connections!: WorkflowConnection;

  @Column({ type: 'jsonb', nullable: true })
  settings!: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  staticData!: Record<string, any>;

  @Column({ nullable: true })
  authors!: string; // JSON string of user IDs who made changes

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne('Workflow')
  @JoinColumn({ name: 'workflowId' })
  workflow!: Workflow;
}
