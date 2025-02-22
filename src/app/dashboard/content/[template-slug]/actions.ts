"use server";

import { db } from "@/server/db";
import { AIOutput } from "@/server/db/schema";
import { type User } from "@clerk/nextjs/dist/types/server";
import moment from "moment";

export const SaveInDb = async (
  formData: any,
  slug: any,
  aiResp: string,
  user: User | null,
) => {
  const result = db.insert(AIOutput).values({
    formData: formData,
    templateSlug: slug,
    aiResponse: aiResp,
    createdBy: user?.primaryEmailAddress?.emailAddress,
    createdAt: moment().format("DD/MM/yyyy"),
  });

  console.log(result);
};
