import { CALENDAR_DATA } from "../config/calendar-data.js";

const getTodayDate = {
  function: () => {
    return new Date().toISOString().split("T")[0];
  },
  declaration: {
    name: "getTodayDate",
    description: "Retorna a data de hoje no formato yyyy-mm-dd",
  },
};

const getEvents = {
  function: (date) => {
    return CALENDAR_DATA[date] ?? [];
  },
  declaration: {
    name: "getEvents",
    description: "Retorna os eventos do calendário para um determinado dia",
    parameters: {
      type: "OBJECT",
      properties: {
        date: {
          type: "STRING",
          description:
            "Data para a qual queremos retornar os eventos, no formato yyyy-mm-dd",
        },
      },
      required: ["date"],
    },
  },
};

const scheduleEvent = {
  function: ({ title, date, time, attendees }) => {
    const eventList = CALENDAR_DATA[date] ?? [];

    eventList.push({
      title,
      time,
      attendees: attendees ?? [],
    });

    CALENDAR_DATA[date] = eventList;

    return "Evento adicionado com sucesso!";
  },
  declaration: {
    name: "scheduleEvent",
    description:
      "Marca um novo evento na agenda para um determinado dia e horário",
    parameters: {
      type: "OBJECT",
      properties: {
        title: {
          type: "STRING",
          description: "Título do evento a ser agendado",
        },
        date: {
          type: "STRING",
          description: "A data do evento, no formato yyyy-mm-dd",
        },
        time: {
          type: "STRING",
          description: "O horário do evento, no formato HH:MM",
        },
        attendees: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Lista de nomes de convidados para o evento",
        },
      },
      required: ["title", "date", "time"],
    },
  },
};

const rescheduleEvent = {
  function: ({ title, date, newTime, attendees }) => {
    const eventList = CALENDAR_DATA[date] ?? [];

    if (eventList === null) {
      return "Evento não encontrado para a data especificada.";
    }

    eventIndex = eventList.findIndex((event) => event.title === title);

    CALENDAR_DATA[date][eventIndex].time = newTime;

    return "Evento atualizado com sucesso!";
  },
  declaration: {
    name: "rescheduleEvent",
    description:
      "Remarca um novo evento na agenda para um novo horário ou data",
    parameters: {
      type: "OBJECT",
      properties: {
        title: {
          type: "STRING",
          description: "Título do evento para remarcar",
        },
        date: {
          type: "STRING",
          description: "A data do evento, no formato yyyy-mm-dd",
        },
        newTime: {
          type: "STRING",
          description: "O novo horário do evento, no formato HH:MM",
        },
        attendees: {
          type: "ARRAY",
          items: { type: "STRING" },
          description: "Lista de nomes de convidados para o evento",
        },
      },
      required: ["title", "date", "newTime"],
    },
  },
};

export { getTodayDate, getEvents, scheduleEvent, rescheduleEvent };
