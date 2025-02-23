"use client";

import { saveGeneratedContent } from "@/actions/content";
import Templates from "@/app/(data)/Templates";
import FormSection from "@/app/dashboard/content/_components/FormSection";
import OutputSection from "@/app/dashboard/content/_components/OutputSection";
import { Button } from "@/components/ui/button";
import { chatSession } from "@/lib/gemini-model";
import { useUser } from "@clerk/nextjs";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  params: {
    "template-slug": string;
  };
}

type FormData = Record<string, string>;

function CreateNewContent({ params }: Props) {
  const selectedTemplate = Templates?.find(
    (item) => item.slug === params["template-slug"],
  );
  const [loading, setLoading] = useState(false);
  const [aiOutput, setAiOutput] = useState("");
  const { user } = useUser();

  const generateAIContent = async (formData: FormData) => {
    try {
      setLoading(true);
      const selectedPrompt = selectedTemplate?.aiPrompt;
      const finalAIPrompt = JSON.stringify(formData) + ", " + selectedPrompt;
      const result = await chatSession.sendMessage(finalAIPrompt);
      const responseText = result?.response.text() || "";

      setAiOutput(responseText);

      const saveResult = await saveGeneratedContent({
        formData: JSON.stringify(formData),
        templateSlug: selectedTemplate?.slug ?? "",
        aiResponse: responseText,
        createdBy: user?.primaryEmailAddress?.emailAddress ?? "",
      });

      if (!saveResult.success) {
        toast.error(saveResult.error ?? "Failed to save content");
      }
    } catch (error) {
      console.error("Failed to generate content:", error);
      toast.error("Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5">
      <Link href="/dashboard/content">
        <Button variant="secondary">
          <ArrowLeft /> Back
        </Button>
      </Link>
      <div className="grid grid-cols-1 gap-5 py-5 md:grid-cols-3">
        <FormSection
          selectedTemplate={selectedTemplate}
          userFormInput={generateAIContent}
          loading={loading}
        />
        <div className="col-span-2">
          <OutputSection aiOutput={aiOutput} />
        </div>
      </div>
    </div>
  );
}

export default CreateNewContent;
