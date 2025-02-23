'use server'

import { db } from "@/server/db";
import { AIOutput } from "@/server/db/schema";
import moment from "moment";

interface SaveEmailInput {
  formData: string;
  slug: string;
  aiResponse: string;
  createdBy: string;
}

interface SaveEmailResponse {
  success: boolean;
  error?: string;
}

export async function saveEmailToDb({
  formData,
  slug,
  aiResponse,
  createdBy,
}: SaveEmailInput): Promise<SaveEmailResponse> {
  try {
    await db.insert(AIOutput).values({
      formData,
      templateSlug: slug,
      aiResponse,
      createdBy,
      createdAt: moment().format("DD/MM/yyyy"),
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Failed to save email:', error);
    return {
      success: false,
      error: 'Failed to save email to database'
    };
  }
}
