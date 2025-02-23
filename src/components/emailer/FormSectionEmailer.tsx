"use client";
import { type TEMPLATE } from "@/components/content/TemplateListSection";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";

type FormData = Record<string, string>;

interface PROPS {
  selectedTemplate?: TEMPLATE;
  userFormInput: (data: FormData) => Promise<void>;
  loading: boolean;
}

function FormSectioEmailer({
  selectedTemplate,
  userFormInput,
  loading,
}: PROPS) {
  const [formData, setFormData] = useState<FormData>({});

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void userFormInput(formData);
  };

  return (
    <div className="rounded-lg border bg-white p-5 text-black shadow-md">
      <form className="mt-6" onSubmit={onSubmit}>
        {selectedTemplate?.form?.map((item) => (
          <div key={item.name} className="my-2 mb-7 flex flex-col gap-2">
            <label className="font-bold">{item.label}</label>
            {item.field === "input" ? (
              <Input
                name={item.name}
                required={item?.required}
                onChange={handleInputChange}
              />
            ) : item.field === "textarea" ? (
              <>
                <Textarea
                  name={item.name}
                  required={item?.required}
                  rows={5}
                  maxLength={2000}
                  onChange={handleInputChange}
                />
                <label className="text-xs text-gray-400">
                  Note: Max 2000 Words
                </label>
              </>
            ) : null}
          </div>
        ))}
        <Button type="submit" className="w-full py-6" disabled={loading}>
          {loading && <Loader2Icon className="mr-2 animate-spin" />}
          Generate Content
        </Button>
      </form>
    </div>
  );
}

export default FormSectioEmailer;
