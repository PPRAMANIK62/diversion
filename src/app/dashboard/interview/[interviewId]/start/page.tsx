"use client";

import {
  type InterviewData,
  type Question,
  getStartInterviewDetails,
} from "@/actions/interview";
import QuestionsSection from "@/components/interview/start/question-section";
import RecordAnswerSection from "@/components/interview/start/record-answer-section";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const StartInterview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [interviewData, setInterviewData] = useState<InterviewData | null>(
    null,
  );
  const [mockInterviewQuestion, setMockInterviewQuestion] = useState<
    Question[]
  >([]);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const params = useParams();

  useEffect(() => {
    void fetchInterviewDetails();
  }, [params.interviewId]);

  const fetchInterviewDetails = async () => {
    try {
      setIsLoading(true);
      const result = await getStartInterviewDetails(
        params.interviewId as string,
      );

      if (result.success && result.data) {
        setInterviewData(result.data.interview);
        setMockInterviewQuestion(result.data.questions);
      } else {
        toast.error(result.error ?? "Failed to fetch interview details");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full flex-col gap-8 md:p-5">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <QuestionsSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
        />

        <RecordAnswerSection
          mockInterviewQuestion={mockInterviewQuestion}
          activeQuestionIndex={activeQuestionIndex}
          interviewData={interviewData}
        />
      </div>
      <div className="flex justify-end gap-6">
        {activeQuestionIndex > 0 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
          >
            Previous Question
          </Button>
        )}
        {activeQuestionIndex < mockInterviewQuestion.length - 1 && (
          <Button
            onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
          >
            Next Question
          </Button>
        )}
        {activeQuestionIndex === mockInterviewQuestion.length - 1 && (
          <Link href={`/dashboard/interview/${interviewData?.mockId}/feedback`}>
            <Button>End Interview</Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default StartInterview;
