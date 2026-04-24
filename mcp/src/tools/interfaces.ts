import { z } from "zod";

export interface ToolDefinition {
  name: string;
  config: {
    description: string;
    inputSchema: z.ZodObject<any>;
    outputSchema?: z.ZodObject<any>;
  };
  handler: (args: any) => Promise<any>;
}
