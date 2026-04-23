import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEN_AI_API_KEY,
});

const contents = [
  {
    role: "user",
    parts: [{ text: "Qual a temperatura do Brasil?" }],
  },
];

let response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: contents,
  config: {
    tools: [
      {
        functionDeclarations: [
          {
            name: "getTodayDate",
            description: "Retorna a data de hoje no formato yyyy-mm-dd",
          },
          {
            name: "getCountryTemperature",
            description: "Retorna a temperatura do país especificado",
            parameters: {
              type: "OBJECT",
              properties: {
                country: {
                  type: "STRING",
                  description: "País para o qual se quer saber a temperatura",
                },
                isCelsius: {
                  type: "BOOLEAN",
                  description:
                    "Indica se a temperatura deve ser retornada em Celsius (true) ou Fahrenheit (false) e o padrão é true",
                },
              },
              required: ["country", "isCelsius"],
            },
          },
        ],
      },
    ],
  },
});

console.log(response.candidates[0].content.parts[0].functionCall);

// contents.push(response.candidates[0].content);

// contents.push({
//   role: "user",
//   parts: [
//     {
//       functionResponse: {
//         name: "getTodayDate",
//         response: { result: "2026-04-07" },
//       },
//     },
//   ],
// });

// response = await ai.models.generateContent({
//   model: "gemini-2.5-flash",
//   contents: contents,
// });

// console.log(response.candidates[0].content);
