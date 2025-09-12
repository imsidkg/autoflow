import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Workflow } from './Workflow';

// Entity: Webhook
@Entity('webhooks')
@Index(['webhookPath', 'method'], { unique: true })
export class Webhook {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  workflowId!: string;

  @Column()
  webhookPath!: string;

  @Column()
  method!: string; // GET, POST, PUT, DELETE, etc.

  @Column()
  node!: string; // Node name that created this webhook

  @Column({ nullable: true })
  webhookId?: string; // For trigger webhooks

  @Column({ nullable: true })
  pathLength?: number;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(() => Workflow)
  @JoinColumn({ name: 'workflowId' })
  workflow!: Workflow;
}
