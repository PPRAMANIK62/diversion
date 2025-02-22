import { GoogleGenerativeAI } from "@google/generative-ai";
import { isAxiosError } from "axios";
import { type NextRequest, NextResponse } from "next/server";

function fileToGenerativePart(base64Data: string, mimeType: string) {
  return {
    inlineData: {
      data: base64Data,
      mimeType,
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const pdfFile = formData.get("pdfFile") as File;
    const tips = (formData.get("tips") as string) || "";
    const jobRole = formData.get("jobRole") as string;

    if (!pdfFile || !jobRole) {
      throw new Error("Please provide a PDF file and job role");
    }

    const genAI = new GoogleGenerativeAI(
      process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-8b" });

    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    const base64Data = buffer.toString("base64");

    const prompt = `
You are an expert ATS and resume analyzer. Analyze the resume for the position of ${jobRole} using these criteria:

1. Calculate a dynamic score (1-100) based on:
   - Relevance to ${jobRole} requirements (0-30 points)
   - Experience alignment (0-20 points)
   - Skills match (0-20 points)
   - Education relevance (0-10 points)
   - ATS compatibility (0-10 points)
   - Resume formatting and clarity (0-10 points)

2. Apply penalties:
   - Missing crucial skills (-5 points each)
   - Irrelevant experience (-5 points)
   - Poor formatting (-5 points)
   - Lack of quantifiable achievements (-5 points)

Analyze the resume thoroughly and provide a detailed response structured as a JSON object with:
{
  "error": boolean,
  "errorMessage": string,
  "content": {
    "score": number, // Calculated based on above criteria
    "scoreBreakdown": {
      "relevance": number,
      "experience": number,
      "skills": number,
      "education": number,
      "atsCompatibility": number,
      "formatting": number,
      "penalties": number
    },
    "summary": string,
    "suggestions": string[],
    "additional_tips": string
  }
}

Consider ${tips} while analyzing. Be critical and realistic in scoring. Ensure the score reflects the actual fit for ${jobRole}.`;

    const pdfPart = fileToGenerativePart(base64Data, pdfFile.type);

    const result = await model.generateContent([prompt, pdfPart]);

    const content = JSON.parse(
      result.response
        .text()
        .replace(/^\s*```json/, "")
        .replace(/```$/, ""),
    );

    if (content.error) {
      throw new Error(content.errorMessage);
    }

    return NextResponse.json(content, { status: 200 });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
