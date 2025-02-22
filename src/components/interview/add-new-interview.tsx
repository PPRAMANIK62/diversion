"use client";

import generateQuestions from "@/actions/generateQuestions";
import { createInterview } from "@/actions/interview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";

const AddNewInterview = () => {
  const [openDailog, setOpenDailog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useUser();

  const onSubmit = async (e: FormEvent) => {
    setLoading(true);
    e.preventDefault();

    const InputPrompt =
      "Job position - " +
      jobPosition +
      ", Job Description- " +
      jobDesc +
      ", Years of Experience - " +
      jobExperience +
      ", Depending on Job Position, Job Description & Years of Experience, give us minimum " +
      process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT +
      " Interview questions for it, with answers";

    try {
      const MockJsonResp = await generateQuestions(InputPrompt);
      const mckId = nanoid(12);

      if (MockJsonResp && MockJsonResp.length > 0) {
        const serializedJsonResp = JSON.stringify(MockJsonResp);

        const result = await createInterview({
          mockId: mckId,
          jsonMockResp: serializedJsonResp,
          jobPosition,
          jobDesc,
          jobExperience,
          userEmail: user?.primaryEmailAddress?.emailAddress ?? "",
        });

        if (result.success && result.data) {
          setOpenDailog(false);
          router.push("/dashboard/interview/" + result.data.mockId);
          toast.success("Interview created successfully");
        } else {
          toast.error("Failed to create interview");
        }
      } else {
        console.log("MockJsonResp is undefined or empty");
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
    setLoading(false);
  };
  return (
    <div>
      <div
        className="cursor-pointer rounded-lg border border-dashed bg-white p-2 transition-all hover:scale-105 hover:shadow-md"
        onClick={() => setOpenDailog(true)}
      >
        <h2 className="text-center text-lg font-semibold text-black">
          + start new.
        </h2>
      </div>
      <Dialog open={openDailog}>
        <DialogContent className="max-w-2xl bg-white text-black">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              Tell us more about your job interviwing
            </DialogTitle>
            <DialogDescription>
              <form onSubmit={onSubmit}>
                <div>
                  <p className="text-black">
                    Add Details about your job position/role, Job description
                    and years of experience
                  </p>

                  <div className="my-3 mt-7 text-black">
                    <label>Job Role/Job Position</label>
                    <Input
                      placeholder="Ex. Full Stack Developer"
                      required
                      onChange={(event) => setJobPosition(event.target.value)}
                    />
                  </div>
                  <div className="my-3 text-black">
                    <label>Job Description/ Tech Stack (In Short)</label>
                    <Textarea
                      placeholder="Ex. React, Angular, NodeJs, MySql etc"
                      required
                      onChange={(event) => setJobDesc(event.target.value)}
                    />
                  </div>
                  <div className="my-3 text-black">
                    <label>Years of experience</label>
                    <Input
                      placeholder="Ex.5"
                      type="number"
                      max="100"
                      required
                      onChange={(event) => setJobExperience(event.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-5">
                  <Button
                    type="button"
                    className="bg-red-700 text-white hover:bg-red-500"
                    variant="ghost"
                    onClick={() => setOpenDailog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-700 text-white hover:bg-blue-500"
                  >
                    {loading ? (
                      <>
                        <LoaderCircle className="animate-spin" /> Generating
                        from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </div>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
