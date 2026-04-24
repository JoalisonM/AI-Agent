import { z } from "zod";
import type { ToolDefinition } from "./interfaces.js";

interface Email {
  sender: string;
  message: string;
}

const inbox: Email[] = [
  {
    sender: "ana.silva@example.com",
    message: "Olá! Poderíamos remarcar nossa reunião para amanhã às 10h?",
  },
  {
    sender: "carlos.mendes@empresa.com",
    message: "Segue o relatório de desempenho do último trimestre em anexo.",
  },
  {
    sender: "mariana.costa@example.com",
    message:
      "Lembrete: apresentação para o cliente marcada para sexta-feira às 14h.",
  },
  {
    sender: "eduardo.lima@empresa.com",
    message: "Bom dia! Há alguma atualização sobre o projeto de inovação?",
  },
  {
    sender: "beatriz.rocha@example.com",
    message: "Convite: Workshop sobre metodologias ágeis no próximo sábado.",
  },
  {
    sender: "lucas.almeida@empresa.com",
    message: "Reunião de alinhamento confirmada para segunda-feira às 9h.",
  },
  {
    sender: "carla.souza@example.com",
    message: "Ei! Vai participar do churrasco do Dia do Trabalhador?",
  },
  {
    sender: "fernando.gomes@empresa.com",
    message:
      "Enviei os documentos solicitados para revisão. Confirma o recebimento?",
  },
];

const getEmails: ToolDefinition = {
  name: "getEmails",
  config: {
    description: "Retorna todos os emails na caixa de entrada",
    inputSchema: z.object({}), // Sem parâmetros de entrada
    outputSchema: z.object({
      content: z.array(
        z.object({
          type: z.string(),
          text: z.string(),
        }),
      ),
      structuredContent: z.array(
        z.object({
          sender: z.string(),
          message: z.string(),
        }),
      ),
    }),
  },
  handler: async () => {
    // Presumindo que 'inbox' esteja acessível no escopo
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(inbox),
        },
      ],
      structuredContent: inbox,
    };
  },
};

const sendEmail: ToolDefinition = {
  name: "sendEmail",
  config: {
    description: "Envia um email para um contato",
    inputSchema: z.object({
      contact: z.string().describe("O nome do contato para enviar a mensagem"),
      message: z.string().describe("A mensagem a ser enviada"),
    }),
    outputSchema: z.object({
      content: z.array(
        z.object({
          type: z.string(),
          text: z.string(),
        }),
      ),
    }),
  },
  handler: async ({ contact, message }) => {
    // Simulação de envio (mantendo o console.log original se necessário)
    console.log(`Enviando email para ${contact}...`);

    return {
      content: [
        {
          type: "text",
          text: `**Email enviado para ${contact}: ${message}`,
        },
      ],
    };
  },
};

const allDefinitions = [getEmails, sendEmail];
export { allDefinitions };
