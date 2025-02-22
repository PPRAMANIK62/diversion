"use client";

import {
  updateUserAnswer,
  type InterviewData,
  type Question,
} from "@/actions/interview";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { Mic, StopCircle } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useVoiceToText } from "react-speakup";
import Webcam from "react-webcam";
import { toast } from "sonner";

interface RecordAnswerSectionProps {
  mockInterviewQuestion: Question[];
  activeQuestionIndex: number;
  interviewData: InterviewData | null;
}

export default function RecordAnswerSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  interviewData,
}: RecordAnswerSectionProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const { startListening, stopListening, transcript } = useVoiceToText({
    continuous: true,
    lang: "en-US",
  });

  useEffect(() => {
    if (!isRecording && userAnswer?.length > 10) {
      void UpdateUserAnswer();
    }
  }, [isRecording, transcript]);

  const StartStopRecording = async () => {
    if (isRecording) {
      setUserAnswer(transcript);
      stopListening();
      setIsRecording(false);
    } else {
      startListening();
      setIsRecording(true);
    }
  };

  const UpdateUserAnswer = async () => {
    if (!interviewData?.mockId || !user?.primaryEmailAddress?.emailAddress) {
      toast.error("Missing required data");
      return;
    }

    setLoading(true);
    try {
      const result = await updateUserAnswer({
        mockId: interviewData.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        userEmail: user.primaryEmailAddress.emailAddress,
        createdAt: moment().format("DD-MM-yyyy"),
      });

      if (result.success) {
        toast.success("User Answer recorded successfully");
        setUserAnswer("");
      } else {
        toast.error(result.error ?? "Failed to update answer");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center rounded-lg bg-black p-5">
        <Image
          src={"/logo-white-256x256.png"}
          width={200}
          height={200}
          className="absolute"
          alt="Logo"
          priority
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: 500,
            zIndex: 10,
          }}
        />
      </div>
      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="flex animate-pulse items-center gap-2 text-red-600">
            <StopCircle />
            Stop Recording
          </h2>
        ) : (
          <h2 className="text-primary flex items-center gap-2">
            <Mic /> Record Answer
          </h2>
        )}
      </Button>
      <p>{transcript}</p>
    </div>
  );
}
