import "reflect-metadata";
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import {
    User,
    Workflow,
    Execution,
    Credential,
    Webhook,
    Variable,
    WorkflowHistory
  } from './entity';


const dbConfig: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'workflow_automation',
  synchronize: process.env.NODE_ENV !== 'production', // Only for development
  logging: process.env.NODE_ENV === 'development',
  entities: [
    User,
    Workflow,
    Execution,
    Credential,
    Webhook,
    Variable,
    WorkflowHistory
  ],
  migrations: ['src/migrations/*.ts'],
  subscribers: ['src/subscribers/*.ts'],
};

console.log("--- DATABASE CONNECTION CONFIG ---");
console.log(`Host: ${dbConfig.host}`);
console.log(`Port: ${dbConfig.port}`);
console.log(`Username: ${dbConfig.username}`);
console.log(`Database: ${dbConfig.database}`);
console.log("--------------------------------");

export const AppDataSource = new DataSource(dbConfig);
