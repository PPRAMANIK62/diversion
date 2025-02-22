"use client";

import {
  getInterviewDetails,
  type InterviewDetails,
} from "@/actions/interview";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/ui/max-width-wrapper";
import { Lightbulb, WebcamIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";

const Interview = () => {
  const [interviewData, setInterviewData] = useState<InterviewDetails | null>(
    null,
  );
  const [webCamEnabled, setWebCamEnabled] = useState(false);
  const params = useParams();

  useEffect(() => {
    void fetchInterviewDetails();
  }, []);

  const fetchInterviewDetails = async () => {
    try {
      const result = await getInterviewDetails(params.interviewId as string);

      if (result.success && result.data) {
        setInterviewData(result.data);
      } else {
        toast.error(result.error ?? "Failed to fetch interview details");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <MaxWidthWrapper>
      <Navbar />
      <div className="h-screen py-10 pt-24">
        <h2 className="text-2xl font-bold">Let&apos;s Get Started</h2>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="my-5 flex flex-col gap-5">
            <div className="flex flex-col gap-5 rounded-lg border p-5">
              <h2 className="text-lg">
                <strong>Job Role/Job Position: </strong>
                {interviewData?.jobPosition}
              </h2>
              <h2 className="text-lg">
                <strong>Job Description/Tech Stack: </strong>
                {interviewData?.jobDesc}
              </h2>
              <h2 className="text-lg">
                <strong>Years of Experience: </strong>
                {interviewData?.jobExperience}
              </h2>
            </div>
            <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-5">
              <h2 className="flex items-center gap-2 text-yellow-500">
                <Lightbulb />
                <strong>Information</strong>
              </h2>
              <h2 className="mt-3 text-xs text-yellow-600">
                {process.env.NEXT_PUBLIC_INFORMATION_MESSAGE}
              </h2>
            </div>
          </div>
          <div>
            {webCamEnabled ? (
              <Webcam
                onUserMedia={() => setWebCamEnabled(true)}
                onUserMediaError={() => setWebCamEnabled(false)}
                mirrored={true}
                style={{
                  height: 300,
                  width: 300,
                }}
              />
            ) : (
              <>
                <WebcamIcon className="bg-secondary my-7 h-72 w-full rounded-lg border p-20" />
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setWebCamEnabled(true)}
                >
                  Enable Web Cam and Microphone
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-end justify-end">
          <Link
            href={`/dashboard/interview/${params.interviewId as string}/start`}
          >
            <Button>Start Interview</Button>
          </Link>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default Interview;
