"use client";

import { Navbar } from "@/components/Navbar";
import ResumeCard from "@/components/ResumeCard";
import { TextRevealCard } from "@/components/ui/text-reveal-card";
import { IconUpload } from "@tabler/icons-react";
import axios from "axios";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const mainVariant = {
  initial: {
    x: 0,
    y: 0,
  },
  animate: {
    x: 20,
    y: -20,
    opacity: 0.9,
  },
};

const secondaryVariant = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
};

const AnalyzeResume = () => {
  const [file, setFile] = useState<File>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [content, setContent] = useState();
  const [extInp, setExtInp] = useState({
    jobRole: "",
    tips: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (newFiles: File[]) => {
    setFile(newFiles[0]);
  };

  const submitResume = async () => {
    if (!file || !extInp.jobRole) return;

    const formData = new FormData();
    formData.append("pdfFile", file);
    formData.append("tips", extInp.tips || "");
    formData.append("jobRole", extInp.jobRole);

    try {
      setLoading(true);
      const res = await axios.post("/api/analyze", formData);
      if (res.data.error) {
        setError(res.data.errorMessage);
      } else {
        setContent(res.data.content);
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center px-4">
      <div className="h-20 bg-black text-gray-100">
        <Navbar />
      </div>
      <div className="mt-16 w-full">
        <div className="flex h-[10rem] w-full items-center justify-center rounded-2xl bg-black">
          <TextRevealCard
            text="Get Hired Instantly✨"
            revealText="Analyze Your Resume"
          ></TextRevealCard>
        </div>
        <div className="mx-auto w-full max-w-4xl">
          {!(content || error) && (
            <div className="mt-6">
              <motion.div
                onClick={handleClick}
                whileHover="animate"
                className="group/file relative mx-auto block w-full max-w-xl cursor-pointer overflow-hidden rounded-lg"
              >
                <input
                  ref={fileInputRef}
                  id="file-upload-handle"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    handleFileChange(Array.from(e.target.files || []))
                  }
                  className="hidden"
                />
                <div className="mt-5 flex flex-col items-center justify-center">
                  <p className="relative z-20 bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-500 bg-clip-text font-sans text-2xl font-bold text-transparent">
                    Upload file
                  </p>
                  <p className="relative z-20 mt-2 font-sans text-base font-normal text-neutral-400">
                    Click to upload
                  </p>
                  <div className="relative mx-auto mt-10 w-full max-w-xl">
                    {file && (
                      <motion.div
                        key={"file"}
                        layoutId={"file-upload"}
                        className="relative z-40 mx-auto mt-4 flex w-full flex-col items-start justify-start overflow-hidden rounded-md bg-neutral-900 p-4 shadow-sm md:h-24"
                      >
                        <div className="flex w-full items-center justify-between gap-4">
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                            className="max-w-xs truncate text-base text-neutral-300"
                          >
                            {file.name}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                            className="w-fit flex-shrink-0 rounded-lg bg-neutral-800 px-2 py-1 text-sm text-white shadow-input"
                          >
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </motion.p>
                        </div>
                        <div className="mt-2 flex w-full flex-col items-start justify-between text-sm text-neutral-400 md:flex-row md:items-center">
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                            className="rounded-md bg-neutral-800 px-1 py-0.5"
                          >
                            {file.type}
                          </motion.p>
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            layout
                          >
                            modified{" "}
                            {new Date(file.lastModified).toLocaleDateString()}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                    {!file && (
                      <motion.div
                        layoutId="file-upload"
                        variants={mainVariant}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 20,
                        }}
                        className="relative z-40 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md bg-neutral-900 shadow-[0px_10px_50px_rgba(0,0,0,0.1)] group-hover/file:shadow-2xl"
                      >
                        <IconUpload className="h-4 w-4 text-neutral-300" />
                      </motion.div>
                    )}
                    {!file && (
                      <motion.div
                        variants={secondaryVariant}
                        className="absolute inset-0 z-30 mx-auto mt-4 flex h-32 w-full max-w-[8rem] items-center justify-center rounded-md border border-dashed border-sky-400 bg-transparent opacity-0"
                      ></motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
              <div className="mx-auto mt-6 flex w-full max-w-xl flex-col space-y-4">
                <div className="w-full space-y-2">
                  <label htmlFor="job-role" className="text-base text-white">
                    You are expert in...
                  </label>
                  <input
                    id="job-role"
                    type="text"
                    className="w-full rounded-md border border-white bg-transparent p-2 text-sm text-white outline-none"
                    value={extInp.jobRole}
                    onChange={(e) =>
                      setExtInp((p) => ({ ...p, jobRole: e.target.value }))
                    }
                    placeholder="Job Role"
                  />
                </div>
                <div className="w-full space-y-2">
                  <label htmlFor="tips" className="text-base text-white">
                    For Modification Purpose
                  </label>
                  <input
                    id="tips"
                    className="w-full rounded-md border border-white bg-transparent p-2 text-sm text-white outline-none"
                    type="text"
                    value={extInp.tips}
                    onChange={(e) =>
                      setExtInp((p) => ({ ...p, tips: e.target.value }))
                    }
                    placeholder="Any Tips"
                  />
                </div>
              </div>
              {file && (
                <div className="my-6 flex justify-center">
                  <button
                    disabled={loading}
                    onClick={submitResume}
                    className="relative z-50 inline-flex h-12 overflow-hidden rounded-full p-[1px] transition duration-150 ease-in-out hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
                  >
                    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                      {loading ? "Loading.." : "Submit Resume"}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}
          {(error || content) && (
            <div className="mb-20 mt-0">
              {content && (
                <div className="mx-auto w-full max-w-3xl space-y-6">
                  <ResumeCard content={content} />
                </div>
              )}
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyzeResume;
