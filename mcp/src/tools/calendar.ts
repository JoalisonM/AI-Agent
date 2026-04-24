import { z } from "zod";
import type { ToolDefinition } from "./interfaces.js";

interface Event {
  title: string;
  time: string;
  attendees: string[];
}

interface Calendar {
  [key: string]: Event[];
}

const calendar: Calendar = {
  "2025-04-29": [
    {
      title: "Reunião de Planejamento do Projeto",
      time: "10:00",
      attendees: ["Ana Silva", "Carlos Mendes", "João Pereira"],
    },
  ],
  "2025-04-30": [
    {
      title: "Apresentação de Resultados do Trimestre",
      time: "15:30",
      attendees: ["Mariana Costa", "Eduardo Lima"],
    },
  ],
  "2025-05-01": [
    {
      title: "Feriado do Dia do Trabalhador",
      time: "00:00",
      attendees: ["Ana Silva"],
    },
    {
      title: "Churrasco em família",
      time: "13:00",
      attendees: ["Rafael Oliveira", "Carla Souza", "Beatriz Rocha"],
    },
  ],
  "2025-05-02": [
    {
      title: "Almoço com equipe",
      time: "12:30",
      attendees: ["Carla Souza", "Rafael Oliveira"],
    },
    {
      title: "Reunião com cliente externo",
      time: "17:00",
      attendees: ["Carlos Mendes", "Mariana Costa"],
    },
  ],
  "2025-05-03": [
    {
      title: "Workshop de Inovação",
      time: "09:00",
      attendees: ["Beatriz Rocha", "Fernando Gomes", "Lucas Almeida"],
    },
  ],
  "2025-05-04": [
    {
      title: "Reunião de feedback individual",
      time: "16:00",
      attendees: ["Ana Silva", "João Pereira"],
    },
    {
      title: "Sessão de brainstorming para novo produto",
      time: "18:30",
      attendees: ["Ana Silva", "João Pereira", "Eduardo Lima"],
    },
  ],
  "2025-05-05": [
    {
      title: "Apresentação para diretoria",
      time: "14:00",
      attendees: ["Carlos Mendes", "Mariana Costa", "Lucas Almeida"],
    },
  ],
};

const getTodayDate: ToolDefinition = {
  name: "getTodayDate",
  config: {
    description: "Retorna a data de hoje no formato yyyy-mm-dd",
    inputSchema: z.object({}),
    outputSchema: z.object({
      content: z.array(
        z.object({
          type: z.string(),
          text: z.string(),
        }),
      ),
    }),
  },
  handler: async () => ({
    content: [{ type: "text", text: "2025-05-01" }],
  }),
};

const getEvents: ToolDefinition = {
  name: "getEvents",
  config: {
    description: "Retorna os eventos do calendário para um determinado dia",
    inputSchema: z.object({
      date: z.string().describe("A data no formato yyyy-mm-dd"),
    }),
    outputSchema: z.object({
      content: z.array(
        z.object({
          type: z.string(),
          text: z.string(),
        }),
      ),
      structuredContent: z.array(
        z.object({
          title: z.string(),
          time: z.string(),
          attendees: z.array(z.string()),
        }),
      ),
    }),
  },
  handler: async ({ date }) => {
    const events = calendar[date] ?? [];
    return {
      content: [{ type: "text", text: JSON.stringify(events) }],
      structuredContent: events,
    };
  },
};

const scheduleEvent: ToolDefinition = {
  name: "scheduleEvent",
  config: {
    description: "Marca um novo evento na agenda",
    inputSchema: z.object({
      title: z.string().describe("O título do evento"),
      date: z.string().describe("A data no formato yyyy-mm-dd"),
      time: z.string().describe("A hora no formato HH:MM"),
      attendees: z.array(z.string()).optional().describe("Lista de convidados"),
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
  handler: async ({ title, date, time, attendees }) => {
    const eventList = calendar[date] ?? [];
    eventList.push({ title, time, attendees: attendees ?? [] });
    calendar[date] = eventList;
    return {
      content: [{ type: "text", text: "Evento adicionado com sucesso!" }],
    };
  },
};

const rescheduleEvent: ToolDefinition = {
  name: "rescheduleEvent",
  config: {
    description: "Remarca um evento na agenda para um novo horário",
    inputSchema: z.object({
      title: z.string().describe("O título do evento para remarcar"),
      date: z.string().describe("A data no formato yyyy-mm-dd"),
      newTime: z.string().describe("A hora nova no formato HH:MM"),
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
  handler: async ({ title, date, newTime }) => {
    const eventList = calendar[date] ?? [];
    const eventIndex = eventList.findIndex((obj) => obj.title === title);
    let res =
      eventIndex === -1
        ? "Evento não encontrado"
        : "Evento alterado com sucesso!";

    if (eventIndex !== -1) calendar[date][eventIndex].time = newTime;

    return {
      content: [{ type: "text", text: res }],
    };
  },
};

const allDefinitions: ToolDefinition[] = [
  getTodayDate,
  getEvents,
  scheduleEvent,
  rescheduleEvent,
];

export { allDefinitions };
