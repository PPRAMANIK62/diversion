"use client";
import { Cover } from "@/components/ui/cover";
import { useState } from "react";

import { Navbar } from "@/components/Navbar";
import SearchSection from "@/components/content/SearchSection";
import TemplateListSection from "@/components/content/TemplateListSection";

function Dashboard() {
  const [userSearchInput, setUserSearchInput] = useState<string>();
  return (
    <div>
      <div className="h-20 bg-black text-gray-100">
        <Navbar />
      </div>
      <div className="">
        <h1 className="text-center text-2xl font-bold md:mt-12 md:text-6xl">
          Create All Types of Content <br /> With{" "}
          <Cover>
            <span className="bg-gradient-to-r from-pink-600 via-violet-500 to-cyan-300 bg-clip-text text-transparent">
              Lightning Speed
            </span>
          </Cover>
        </h1>
      </div>
      {/* Search Section  */}
      <SearchSection
        onSearchInput={(value: string) => setUserSearchInput(value)}
      />

      {/* Template List Section  */}
      <TemplateListSection userSearchInput={userSearchInput!} />
    </div>
  );
}

export default Dashboard;
