import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { createAgent } from "langchain";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { State } from "../dto/state.js";
import { ai } from "../services/ai.js";
import z from "zod";

// ReAct -> reasoning acting

const schedulingAppointment = new DynamicStructuredTool({
  name: "scheduling_appointment",
  description: "Marca uma nova consulta para o usuário",
  schema: {},
  func: async () => {
    console.log("Marcando consulta...");
    return "Consulta marcada com sucesso!";
  },
});

const reschedulingAppointment = new DynamicStructuredTool({
  name: "rescheduling_appointment",
  description: "Remarca uma consulta para o usuário",
  schema: {},
  func: async () => {
    console.log("Remarcando consulta...");
    return "Consulta remarcada com sucesso!";
  },
});

const cancelAppointment = new DynamicStructuredTool({
  name: "cancel_appointment",
  description: "Cancela uma consulta para o usuário",
  schema: {},
  func: async () => {
    console.log("Cancelando consulta...");
    return "Consulta cancelada com sucesso!";
  },
});

const schedulingSpecialistAgent = createAgent({
  model: ai,
  tools: [schedulingAppointment, reschedulingAppointment, cancelAppointment],
  systemPrompt: new SystemMessage(
    "Você é um secretário de um consultório, responsável por organizar a agenda." +
      "análise a conversa e tome a melhor ação para atender o usuário",
  ),
});

export const schedulingSpecialist = async (state: typeof State.State) => {
  console.log("Scheduling specialist chamado");

  const result = await schedulingSpecialistAgent.invoke(state);

  const schedulingSpecialistResponse =
    result.messages[result.messages.length - 1].content;

  return {
    messages: [
      new HumanMessage({
        name: "Scheduling Specialist",
        content: schedulingSpecialistResponse,
      }),
    ],
  };
};
