"use client";

import { saveEmailToDb } from "@/app/actions/email";
import { type TEMPLATE } from "@/components/content/TemplateListSection";
import FormSectioEmailer from "@/components/emailer/FormSectionEmailer";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputBar from "@/components/ui/InputBar";
import { TEMPLATES } from "@/constants/templates";
import { chatSession } from "@/lib/gemini-model";
import { useUser } from "@clerk/nextjs";
import { CirclePlus } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "sonner"; // Add this to your dependencies

interface EmailItem {
  id: number;
  receiver: string;
}

type FormData = Record<string, string>;

const OutputSection2 = dynamic(
  () => import("@/components/emailer/OutputSection2"),
  { ssr: false },
);

export default function EmailPage() {
  const selectedTemplate: TEMPLATE | undefined = TEMPLATES?.find(
    (item) => item.slug === "email-writeup",
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [aiOutput, setAiOutput] = useState<string>("");
  const { user } = useUser();

  /**
   * Used to generate content from AI
   * @param formData
   * @returns
   */
  const GenerateAIContent = async (formData: FormData): Promise<void> => {
    try {
      setLoading(true);
      const SelectedPrompt = selectedTemplate?.aiPrompt;
      const FinalAIPrompt = JSON.stringify(formData) + ", " + SelectedPrompt;
      const result = await chatSession.sendMessage(FinalAIPrompt);

      const responseText = result?.response.text() || "";
      setAiOutput(responseText);

      const saveResult = await saveEmailToDb({
        formData: JSON.stringify(formData),
        slug: selectedTemplate?.slug ?? "",
        aiResponse: responseText,
        createdBy: user?.primaryEmailAddress?.emailAddress ?? "",
      });

      if (!saveResult.success) {
        toast.error(saveResult.error ?? "Failed to save email");
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
      toast.error("Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [inputtedEmail, setInputtedEmail] = useState<string>("");

  const handleAddEmail = (): void => {
    if (!inputtedEmail) return;
    setEmails([
      ...emails,
      {
        id: emails.length + 1,
        receiver: inputtedEmail,
      },
    ]);
  };

  return (
    <div>
      <div className="h-20 bg-black text-gray-100">
        <Navbar />
      </div>
      <div className="mb-4 rounded-lg border bg-gradient-to-tl from-green-300 via-blue-500 to-purple-600 p-5 shadow-md">
        <h2 className="mb-2 text-2xl font-bold text-white">
          Scheduler Your Emails
        </h2>
        <p className="text-sm text-gray-200">
          Schedule your emails from here. You can also ask our AI to generate a
          template for you
        </p>
        <div className="my-4 flex flex-col gap-2 md:w-1/2">
          <label className="font-bold text-white">Email</label>
          <div className="flex">
            <Input
              type="email"
              name="email"
              required={true}
              onChange={(e) => setInputtedEmail(e.target.value)}
            />
            <Button type="button" className="ml-2" onClick={handleAddEmail}>
              Add
              <CirclePlus className="ml-2" size={18} />
            </Button>
          </div>
        </div>
      </div>
      <div className="pb-10 pt-2">
        <h2 className="mb-2 text-2xl font-bold text-primary">
          Check emails that will be receiving it
        </h2>
        <InputBar emails={emails} setEmails={setEmails} />
      </div>
      <div className="mb-20 grid grid-cols-1 gap-5 md:grid-cols-3">
        <FormSectioEmailer
          selectedTemplate={selectedTemplate}
          userFormInput={(v: FormData) => GenerateAIContent(v)}
          loading={loading}
        />
        <div className="col-span-2">
          <OutputSection2 aiOutput={aiOutput} emails={emails} />
        </div>
      </div>
    </div>
  );
}
