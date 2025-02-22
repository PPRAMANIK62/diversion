"use server";

import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

export const groq = createOpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateQuestions(inputPrompt: string) {
  console.log(inputPrompt);
  const {
    object: { questions },
  } = await generateObject({
    model: groq.chat("llama-3.3-70b-versatile"),
    schema: z.object({
      questions: z.array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      ),
    }),
    prompt: inputPrompt,
  });
  return questions;
}

export default generateQuestions;
