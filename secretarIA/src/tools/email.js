import { INBOX } from "../config/inbox.js";

const getEmails = {
  function: () => {
    return INBOX;
  },
  declaration: {
    name: "getEmails",
    description: "Retorna todos os e-mails na caixa de entrada",
  },
};

const sendEmail = {
  function: ({ contact, message }) => {
    console.log(`**Email enviado para ${contact}: ${message}`);

    return "Email enviado!";
  },
  declaration: {
    name: "sendEmail",
    description: "Envia um e-mail para um contato",
    parameters: {
      type: "OBJECT",
      properties: {
        contact: {
          type: "STRING",
          description: "O nome do contato para enviar a mensagem",
        },
        message: {
          type: "STRING",
          description: "A mensagem a ser enviada",
        },
      },
      required: ["contact", "message"],
    },
  },
};

export { getEmails, sendEmail };
