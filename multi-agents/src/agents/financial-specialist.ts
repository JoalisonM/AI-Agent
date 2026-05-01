import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { createAgent } from "langchain";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { State } from "../dto/state.js";
import { ai } from "../services/ai.js";
import z from "zod";

// ReAct -> reasoning acting

const payBill = new DynamicStructuredTool({
  name: "pay_bill",
  description: "Pagar a conta do usuário",
  schema: {},
  func: async () => {
    console.log("Pagando conta...");
    return "Conta paga com sucesso!";
  },
});

const getBill = new DynamicStructuredTool({
  name: "get_bill",
  description: "Pegar o valor da conta do usuário",
  schema: {},
  func: async () => {
    console.log("Obtendo valor da conta...");
    return "Sua conta tem o valor de 500 reais";
  },
});

const createBill = new DynamicStructuredTool({
  name: "create_bill",
  description: "Criar um novo boleto para o usuário",
  schema: z.object({
    price: z.number().describe("O valor do boleto em reais"),
  }),
  func: async ({ price }) => {
    console.log("Criando nova boleto...");
    return `Novo boleto criado com sucesso no valor de ${price}`;
  },
});

const financialSpecialistAgent = createAgent({
  model: ai,
  tools: [payBill, getBill, createBill],
  systemPrompt: new SystemMessage(
    "Você é um analista financeiro experiente de um consultório" +
      "análise a conversa e tome a melhor ação para atender o usuário",
  ),
});

export const financialSpecialist = async (state: typeof State.State) => {
  console.log("Financial specialist chamado");

  const result = await financialSpecialistAgent.invoke(state);

  const financialSpecialistResponse =
    result.messages[result.messages.length - 1].content;

  return {
    messages: [
      new HumanMessage({
        name: "Financial Specialist",
        content: financialSpecialistResponse,
      }),
    ],
  };
};
