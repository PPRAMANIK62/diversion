"use client";

import Image from "next/image";
import { Video } from "lucide-react";
import Loader from "@/components/browser/loader"
import Link from "next/link";

export function VideoArea({
  videos,
  isLoading,
}: {
  videos: FinalResultResponse[];
  isLoading: boolean;
}) {
  return (
    <div className="container text-white h-auto w-full shrink-0 rounded-lg border border-solid border-[#C2C2C2] bg-gradient-to-r from-[#ff0b85] via-violet-500 to-cyan-300 p-5 lg:p-10">
      <div className="flex items-start gap-4 pb-3 lg:pb-3.5">
        <Video size={24} />
        <h3 className="text-base font-bold uppercase leading-[152.5%] text-white">
          Videos:{" "}
        </h3>
      </div>
      <div className="max-w-5xl content-center justify-center items-center w-full grid grid-cols-1 md:grid-cols-2 gap-4 mx-auto">
        {isLoading ? (
          <>
            <Loader />
          </>
        ) : videos.length > 0 ? (
          videos.map((video, index) => (
            <a
              href={video.url}
              target="_blank"
              key={index}
              className="flex items-start gap-6 p-6 bg-black hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors border border-gray-100 dark:border-gray-800 text-white"
            >
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={video.image}
                  alt=""
                  fill
                  className="rounded-md object-cover"
                />
              </div>
              <div className="min-w-0 space-y-2">
                <h3 className="text-lg font-medium text-white dark:text-gray-100 break-words">
                  {video.name}
                </h3>
                <p className="text-xs text-blue-500 dark:text-gray-400 break-all">
                  {video.url}
                </p>
              </div>
            </a>
          ))
        ) : (
          <div className="text-center text-gray-400">No videos found</div>
        )}
      </div>
    </div>
  );
}
