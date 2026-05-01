import z from "zod";
import { State } from "../dto/state.js";
import { ai } from "../services/ai.js";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

const routingTool = {
  name: "routingTool",
  description: "Selecione o próximo estado",
  schema: z.object({
    next: z.enum([
      "financial_specialist",
      "scheduling_specialist",
      "comms_specialist",
      "END",
    ]),
  }),
};

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "Você é um supervisor de um consultório. Tome a melhor ação para atender a necessidade do cliente com base na conversar a seguir:" +
      "Ao final de tudo, chame o especialista de comunicação para envia um e-mail para o cliente. Depois disso, finalize o processo.",
  ],
  new MessagesPlaceholder("messages"),
  [
    "human",
    "Escolha um desses próximos estados: financial_specialist, scheduling_specialist, comms_specialist, END (estado terminal se não tiver mais nada para fazer)",
  ],
]);

export const supervisor = async (state: typeof State.State) => {
  console.log("Supervisor escolhendo o próximo");

  const aiWithTool = ai.bindTools([routingTool], {
    tool_choice: "routingTool",
  });

  const aiResponse = await prompt.pipe(aiWithTool).invoke({
    messages: state.messages,
  });

  if (aiResponse.tool_calls) {
    console.log(`Supervisor chamou ${aiResponse.tool_calls[0].args.next}`);

    const nextNode = aiResponse.tool_calls?.[0].args.next;

    return { nextNode };
  } else {
    console.log("Supervisor terminou o chat");

    return { nextNode: "END" };
  }
};
