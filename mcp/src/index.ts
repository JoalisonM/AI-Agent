import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { allDefinitions as calendarDefinitions } from "./tools/calendar.js";
import { allDefinitions as emailDefinitions } from "./tools/email.js";

const allDefinitions = calendarDefinitions.concat(emailDefinitions);

const server = new McpServer({
  name: "secretaria",
  version: "1.0.0",
});

for (const definition of allDefinitions) {
  server.registerTool(definition.name, definition.config, definition.handler);
}

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server funcionando!");
}

try {
  await main();
} catch (error) {
  console.error("Server error:", error);
}
