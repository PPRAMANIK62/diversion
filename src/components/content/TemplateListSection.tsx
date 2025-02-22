/* eslint-disable @typescript-eslint/no-explicit-any */
import { TEMPLATES } from "@/constants/templates";
import { useEffect, useState } from "react";
import TemplateCard from "./TemplateCard";

export interface TEMPLATE {
  name: string;
  desc: string;
  icon: string;
  category?: string;
  slug: string;
  aiPrompt: string;
  form?: FORM[];
}

export interface FORM {
  label: string;
  field: string;
  name: string;
  required?: boolean;
}

function TemplateListSection({ userSearchInput }: { userSearchInput: string }) {
  const [templateList, setTemplateList] = useState(TEMPLATES);
  useEffect(() => {
    if (userSearchInput) {
      const filterData = TEMPLATES.filter((item) =>
        item.name.toLowerCase().includes(userSearchInput.toLowerCase()),
      );
      setTemplateList(filterData);
    } else {
      setTemplateList(TEMPLATES);
    }
  }, [userSearchInput]);

  return (
    <div className="mb-16 grid grid-cols-2 gap-5 p-5 md:grid-cols-3 lg:grid-cols-4">
      {templateList.map((item: TEMPLATE, index) => (
        <TemplateCard {...item} key={index} />
      ))}
    </div>
  );
}

export default TemplateListSection;
