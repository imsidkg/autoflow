import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import type { User } from './User.js'; // Add 'type'
import type { Execution } from './Execution.js'; // Add 'type'



import type { WorkflowNode, WorkflowConnection } from '../types/workflow';

@Entity('workflows')
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'jsonb' })
  nodes!: WorkflowNode[];

  @Column({ type: 'jsonb' })
  connections!: WorkflowConnection[];

  @Column({ default: false })
  active!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  settings!: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  staticData!: Record<string, any>;

  @Column({ nullable: true })
  description!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column()
  ownerId!: string;

  @ManyToOne('User', (user: User) => user.workflows)
  @JoinColumn({ name: 'ownerId' })
  owner!: User;

  @OneToMany('Execution', (execution: Execution) => execution.workflow)
  executions!: Execution[];
}
