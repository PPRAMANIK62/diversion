"use server";

import { chatSession } from "@/lib/gemini-model";
import { db } from "@/server/db";
import { MockInterview, UserAnswer } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import moment from "moment";

interface CreateInterviewProps {
  mockId: string;
  jsonMockResp: string;
  jobPosition: string;
  jobDesc: string;
  jobExperience: string;
  userEmail: string;
}

export interface InterviewDetails {
  mockId: string;
  jobPosition: string;
  jobDesc: string;
  jobExperience: string;
  jsonMockResp: string;
  createdAt: string;
  createdBy: string;
}

export interface InterviewData {
  mockId: string;
  jsonMockResp: string;
  jobPosition: string;
  jobDesc: string;
  jobExperience: string;
  createdAt: string;
  createdBy: string;
}

export interface Question {
  question: string;
  answer: string;
}

export async function createInterview({
  mockId,
  jsonMockResp,
  jobPosition,
  jobDesc,
  jobExperience,
  userEmail,
}: CreateInterviewProps) {
  try {
    const resp = await db
      .insert(MockInterview)
      .values({
        mockId: mockId,
        jsonMockResp: jsonMockResp,
        jobPosition: jobPosition,
        jobDesc: jobDesc,
        jobExperience: jobExperience,
        createdBy: userEmail,
        createdAt: moment().format("DD-MM-yyyy"),
      })
      .returning({
        mockId: MockInterview.mockId,
        jsonMockResp: MockInterview.jsonMockResp,
      });

    return { success: true, data: resp[0] };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: "Failed to create interview" };
  }
}

export async function getInterviewDetails(interviewId: string) {
  try {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    if (!result || result.length === 0) {
      return { success: false, error: "Interview not found" };
    }

    return { success: true, data: result[0] as InterviewDetails };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: "Failed to fetch interview details" };
  }
}

export async function getStartInterviewDetails(interviewId: string) {
  try {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    if (!result || result.length === 0) {
      return { success: false, error: "Interview not found" };
    }

    const interviewData = result[0] as InterviewData;
    const deserializedQuestions = JSON.parse(
      interviewData.jsonMockResp,
    ) as Question[];

    return {
      success: true,
      data: {
        interview: interviewData,
        questions: deserializedQuestions,
      },
    };
  } catch (error) {
    console.error("Database error:", error);
    return { success: false, error: "Failed to fetch interview details" };
  }
}

interface UpdateUserAnswerProps {
  mockId: string;
  question: string;
  correctAns: string;
  userAns: string;
  userEmail: string;
  createdAt: string;
}

export async function updateUserAnswer({
  mockId,
  question,
  correctAns,
  userAns,
  userEmail,
  createdAt,
}: UpdateUserAnswerProps) {
  try {
    const feedbackPrompt =
      "Question:" +
      question +
      ", User Answer:" +
      userAns +
      ",Depends on question and user answer for give interview question " +
      "please give us rating for answer and feedback as area of improvmenet if any " +
      "in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");
    const JsonFeedbackResp = JSON.parse(mockJsonResp) as {
      feedback: string;
      rating: string;
    };

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: mockId,
      question,
      correctAns,
      userAns,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail,
      createdAt,
    });

    return { success: true, data: resp };
  } catch (error) {
    console.error("Error updating user answer:", error);
    return { success: false, error: "Failed to update user answer" };
  }
}

export interface FeedbackItem {
  id: number;
  mockIdRef: string;
  question: string;
  correctAns: string | null;
  userAns: string | null;
  feedback: string | null;
  rating: string | null;
  userEmail: string | null;
  createdAt: string | null;
}

export async function getFeedback(interviewId: string) {
  try {
    const result = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.mockIdRef, interviewId))
      .orderBy(UserAnswer.id);

    return { success: true, data: result as FeedbackItem[] };
  } catch (error) {
    console.error("Error fetching feedback:", error);
    return { success: false, error: "Failed to fetch feedback" };
  }
}
