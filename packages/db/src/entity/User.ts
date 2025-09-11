import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Workflow } from './Workflow';
import { Execution } from './Execution';
import { Credential } from './Credential';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  passwordHash: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Workflow, workflow => workflow.owner)
  workflows: Workflow[];

  @OneToMany(() => Execution, execution => execution.user)
  executions: Execution[];

  @OneToMany(() => Credential, credential => credential.owner)
  credentials: Credential[];
}