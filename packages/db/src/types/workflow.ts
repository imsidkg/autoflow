export interface NodeExecutionData {
  data: {
    main: any[][];
  };
  source: {
    main?: Array<{
      previousNode: string;
      previousNodeOutput?: number;
      previousNodeRun?: number;
    }>;
  };
}

export interface WorkflowExecuteMode {
  mode: 'manual' | 'trigger' | 'webhook' | 'retry';
  startNodes?: string[];
  destinationNode?: string;
}

export interface TriggerResponse {
  closeFunction?: () => Promise<void>;
  // For webhook triggers
  webhookData?: {
    workflowId: string;
    node: string;
  };
}

// Added WorkflowNode and WorkflowConnection interfaces
export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: Record<string, any>;
  credentials?: Record<string, string>;
}

export interface WorkflowConnection {
  [outputNodeName: string]: {
    [outputIndex: string]: Array<{
      node: string;
      type: string;
      index: number;
    }>;
  };
}