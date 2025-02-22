"use client";

import { type FeedbackItem, getFeedback } from "@/actions/interview";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Feedback() {
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    void fetchFeedback();
  }, [params.interviewId]);

  const fetchFeedback = async () => {
    try {
      const result = await getFeedback(params.interviewId as string);

      if (result.success) {
        setFeedbackList(result.data!);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch feedback");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex w-full flex-col gap-8 md:p-5">
      {feedbackList.length === 0 ? (
        <h2 className="text-xl font-bold text-gray-500">
          No Interview Feedback Record Found
        </h2>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-green-500">
            Congratulations!
          </h2>
          <h2 className="text-2xl font-bold">
            Here is your interview feedback
          </h2>
          <h2 className="text-sm text-gray-500">
            Find below interview questions with correct answers, your answers
            and feedback for improvement
          </h2>
          {feedbackList.map((item) => (
            <Collapsible key={item.id} className="mt-7">
              <CollapsibleTrigger className="bg-secondary my-2 flex w-full justify-between gap-7 rounded-lg p-2 text-left">
                {item.question} <ChevronsUpDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2">
                  <h2 className="rounded-lg border p-2 text-red-500">
                    <strong>Rating: </strong>
                    {item.rating}
                  </h2>
                  <h2 className="rounded-lg border bg-red-200 p-2 text-sm text-red-900">
                    <strong>Your Answer: </strong>
                    {item.userAns}
                  </h2>
                  <h2 className="rounded-lg border bg-green-50 p-2 text-sm text-green-900">
                    <strong>Correct Answer: </strong>
                    {item.correctAns}
                  </h2>
                  <h2 className="text-primary rounded-lg border bg-blue-50 p-2 text-sm">
                    <strong>Feedback: </strong>
                    {item.feedback}
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}
      <Button
        onClick={() => router.replace("/dashboard/interview")}
        className="mt-2"
      >
        Go Home
      </Button>
    </div>
  );
}
