/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { fetchUserResumes } from "@/actions/resume";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import AddResume from "../common/AddResume";
import ResumeCard from "../common/ResumeCard";

const DashboardCards = () => {
  const user = useUser();
  const userId = user?.user?.id;
  const [resumeList, setResumeList] = useState(null);

  const loadResumeData = async () => {
    try {
      const resumeData = await fetchUserResumes(userId ?? "");

      setResumeList(JSON.parse(resumeData));
    } catch (error) {
      console.error("Error fetching resume:", error);
    }
  };

  useEffect(() => {
    user?.isSignedIn && void loadResumeData();
  }, [user?.isLoaded]);

  return (
    <>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        <AddResume userId={userId} />

        {resumeList !== null
          ? resumeList.map((resume: any) => (
              <ResumeCard
                key={resume.resumeId}
                resume={JSON.stringify(resume)}
                refreshResumes={loadResumeData}
              />
            ))
          : [1, 2, 3].map((index) => (
              <div
                key={index}
                className="h-full w-full animate-pulse rounded-lg bg-gray-200"
              ></div>
            ))}
      </div>
    </>
  );
};

export default DashboardCards;
