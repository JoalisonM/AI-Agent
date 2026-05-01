import fs from "node:fs";
import { StateGraph, START, END } from "@langchain/langgraph";
import { State } from "./dto/state.js";
import { supervisor } from "./agents/supervisor.js";
import { financialSpecialist } from "./agents/financial-specialist.js";
import { schedulingSpecialist } from "./agents/scheduling-specialist.js";
import { commsSpecialist } from "./agents/comms-specialist.js";
import { HumanMessage } from "@langchain/core/messages";

const graph = new StateGraph(State)
  .addNode("supervisor", supervisor)
  .addNode("financial_specialist", financialSpecialist)
  .addNode("scheduling_specialist", schedulingSpecialist)
  .addNode("comms_specialist", commsSpecialist)
  .addEdge(START, "supervisor")
  .addConditionalEdges("supervisor", (state: typeof State.State) => {
    return state.nextNode;
  })
  .addEdge("financial_specialist", "supervisor")
  .addEdge("scheduling_specialist", "supervisor")
  .addEdge("comms_specialist", END)
  .compile();

const result = await graph.invoke({
  messages: [new HumanMessage("olá, quero marcar uma nova consulta")],
});

console.log(result);

const drawableGraph = await graph.getGraphAsync();
const graphImage = await drawableGraph.drawMermaidPng();
const graphArrayBuffer = await graphImage.arrayBuffer();

fs.writeFileSync("./graph.png", new Uint8Array(graphArrayBuffer));
