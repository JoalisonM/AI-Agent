import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { createAgent } from "langchain";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { State } from "../dto/state.js";
import { ai } from "../services/ai.js";
import z from "zod";

// ReAct -> reasoning acting

const sendEmail = new DynamicStructuredTool({
  name: "send_email",
  description: "Envia um e-mail para o usuário",
  schema: z.object({
    emailContent: z.string(),
  }),
  func: async ({ emailContent }) => {
    console.log("Email enviado para o usuário...");
    return `E-mail enviado com sucesso: ${emailContent}`;
  },
});

const commsSpecialistAgent = createAgent({
  model: ai,
  tools: [sendEmail],
  systemPrompt: new SystemMessage(
    "Você é um secretário de um consultório, responsável por enviar comunicações para os clientes." +
      "Sumarize toda a conversa e todas as ações que foram feitas e envia um e-mail para o cliente.",
  ),
});

export const commsSpecialist = async (state: typeof State.State) => {
  console.log("Comms specialist chamado");

  const result = await commsSpecialistAgent.invoke(state);

  const commsSpecialistResponse =
    result.messages[result.messages.length - 1].content;

  return {
    messages: [
      new HumanMessage({
        name: "Comms Specialist",
        content: commsSpecialistResponse,
      }),
    ],
  };
};
