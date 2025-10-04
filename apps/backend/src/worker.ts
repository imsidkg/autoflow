import Redis from 'ioredis';
import { processWorkflow } from './services/workflowEngine';

// It's a good practice to use environment variables for Redis connection
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const QUEUE_NAME = 'workflow-execution-queue';

const startWorker = async () => {
  console.log(`Worker started. Waiting for jobs on queue: ${QUEUE_NAME}`);
  
  // Ensure we have a connection before starting the loop
  await redis.ping();

  while (true) {
    try {
      // Wait indefinitely for a job to appear on the queue
      // The '0' means it will wait forever without timing out.
      const result = await redis.blpop(QUEUE_NAME, 0);

      if (result) {
        // blpop returns an array: [queueName, job]
        const executionId = result[1]; 
        console.log(`[Worker] Picked up job: ${executionId}`);

        // Call the processing function for this specific job
        await processWorkflow(executionId);
      }
    } catch (error) {
      console.error(`[Worker] Error processing job:`, error);
      // In a real-world scenario, you might want more sophisticated error handling,
      // like moving the job to a "dead-letter" queue after several retries.
      
      // For now, we'll wait 5 seconds before trying to get a new job
      // to prevent a fast loop in case of a persistent error (e.g., Redis connection issue).
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

startWorker().catch(err => {
  console.error("[Worker] Failed to start:", err);
  process.exit(1);
});
