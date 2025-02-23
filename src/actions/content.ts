"use server";

import { db } from "@/server/db";
import { AIOutput } from "@/server/db/schema";
import moment from "moment";

interface SaveContentInput {
  formData: string;
  templateSlug: string;
  aiResponse: string;
  createdBy: string;
}

interface SaveContentResponse {
  success: boolean;
  error?: string;
}

export async function saveGeneratedContent({
  formData,
  templateSlug,
  aiResponse,
  createdBy,
}: SaveContentInput): Promise<SaveContentResponse> {
  if (!formData || !templateSlug || !aiResponse || !createdBy) {
    return { success: false, error: "Missing required fields" };
  }

  try {
    await db.insert(AIOutput).values({
      formData,
      templateSlug,
      aiResponse,
      createdBy,
      createdAt: moment().format("DD/MM/yyyy"),
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving content:", error);
    return { success: false, error: "Failed to save content" };
  }
}
