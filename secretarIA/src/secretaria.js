import readline from "node:readline";

import { gemini } from "./services/gemini.js";
import {
  getTodayDate,
  getEvents,
  scheduleEvent,
  rescheduleEvent,
} from "./tools/calendar.js";
import { getEmails, sendEmail } from "./tools/email.js";

const definitions = [
  getTodayDate,
  getEvents,
  scheduleEvent,
  rescheduleEvent,
  getEmails,
  sendEmail,
];
const declarations = definitions.map((def) => def.declaration);
const functions = Object.fromEntries(
  definitions.map((def) => [def.declaration.name, def.function]),
);

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
      tools: [
        {
          functionDeclarations: declarations,
        },
      ],
    },
  });

  while (response.functionCalls) {
    for (const func of response.functionCalls) {
      const functionToExecute = func.name;
      const functionParameters = func.args;

      console.log(`** Função a ser executada: ${functionToExecute} **`);

      const fn = functions[functionToExecute];
      const functionResult = await fn(functionParameters);

      const functionResponse = {
        role: "user",
        parts: [
          {
            functionResponse: {
              name: functionToExecute,
              response: { result: functionResult },
            },
          },
        ],
      };

      contents.push(functionResponse);
    }

    response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        tools: [
          {
            functionDeclarations: declarations,
          },
        ],
      },
    });
  }

  console.log("IA ", response.candidates[0].content.parts[0]);
}
