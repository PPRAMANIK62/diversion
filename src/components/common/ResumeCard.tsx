/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { deleteResume } from "@/lib/actions/resume.actions";
import { Loader2, MoreVertical } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";

const ResumeCard = ({
  resume,
  refreshResumes,
}: {
  resume: any;
  refreshResumes: () => void;
}) => {
  if (!resume) {
    return (
      <div className="skeleton relative flex aspect-[1/1.2] flex-col rounded-lg bg-gray-200 shadow-lg transition-all hover:scale-105">
        <div className="flex-1"></div>
        <div className="flex justify-between rounded-b-lg border-0 bg-white/40 p-3">
          ‎{" "}
        </div>
      </div>
    );
  }

  const router = useRouter();
  const pathname = usePathname();
  const myResume = JSON.parse(resume);
  const [openAlert, setOpenAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const onDelete = async () => {
    setIsLoading(true);

    const result = await deleteResume(myResume.resumeId, pathname);

    setIsLoading(false);
    setOpenAlert(false);

    if (result.success) {
      toast({
        title: "Information saved.",
        description: "Resume deleted successfully.",
        className: "bg-white",
      });

      refreshResumes();
    } else {
      toast({
        title: "Uh Oh! Something went wrong.",
        description: result?.error,
        variant: "destructive",
        className: "bg-white",
      });
    }
  };

  return (
    <div className="relative flex aspect-[1/1.2] flex-col transition-all hover:scale-105">
      <Link href={"/resume/" + myResume.resumeId} className="flex-grow">
        <div
          className="h-full rounded-t-lg border-t-4 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200"
          style={{
            borderColor: myResume?.themeColor,
          }}
        >
          <div className="flex size-full items-center justify-center">
            <img src="/cv.svg" width={100} height={100} />
          </div>
        </div>
      </Link>

      <div className="flex justify-between rounded-b-lg border bg-white p-3 shadow-lg">
        <h2 className="mr-4 block overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium text-slate-700">
          {myResume.title}
        </h2>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4 cursor-pointer" color="#000" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={() =>
                router.push("/dashboard/resume/" + myResume.resumeId + "/edit")
              }
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => router.push("/resume/" + myResume.resumeId)}
            >
              View
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setOpenAlert(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={openAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setOpenAlert(false)}
              disabled={isLoading}
              className="no-focus"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp; Deleting
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResumeCard;
