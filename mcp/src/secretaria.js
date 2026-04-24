import readline from "node:readline";
import path from "node:path";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { Client } from "@modelcontextprotocol/sdk/client";
import { gemini } from "./services/gemini.js";
import { mcpToTool } from "@google/genai";

const serverPath = path.join(import.meta.dirname, "index.js");

const serverParams = new StdioClientTransport({
  command: "node",
  args: [serverPath],
});

const client = new Client({
  name: "secretaria-client",
  version: "1.0.0",
});

await client.connect(serverParams);

const contents = [];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

while (true) {
  const query = await new Promise((resolve) => {
    rl.question("Você: ", resolve);
  });

  contents.push({
    role: "user",
    parts: [{ text: query }],
  });

  let response = await gemini.models.generateContent({
    model: "gemini-2.5-flash",
    contents: contents,
    config: {
      tools: [mcpToTool(client)],
    },
  });

  console.log("IA ", response.candidates[0].content.parts[0].text);
}
