"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/textSpeech/alert-dialog";
import { Button } from '@/components/textSpeech/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/textSpeech/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/textSpeech/dropdown-menu";
import { Textarea } from '@/components/textSpeech/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/textSpeech/tooltip";
import { languages } from '@/lib/nativelanguages';
import     useOutputText  from '@/store/translator/outputText';
import useInputText from "@/store/translator/inputText";
import useInputLang from "@/store/translator/inputLang";
import useOutputLang from "@/store/translator/outputLang";


import axios from 'axios';
import { ChevronDown, Loader2, MessageSquareText, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useMediaQuery } from 'usehooks-ts';

const Topbar = () => {

    const { inputLang, setInputLang } = useInputLang();

    const { outputLang, setOutputLang } = useOutputLang();

    const { inputText } = useInputText();

    const { outputText, setOutputText } = useOutputText();

    const [isOpen, setIsOpen] = useState<boolean>(false);

    const [feedback, setFeedback] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const isMobile = useMediaQuery('(max-width: 450px)');

    const handleDeleteText = () => {
        setOutputText("");
    };

    const handleLangChange = () => {
        toast.info("As of now, only English language is supported. More languages will be added soon.")
    };

    const handleSendFeedback = async () => {
        try {

            setIsLoading(true);

            if (!feedback) {
                toast.error("Please enter some feedback");
                setIsLoading(false);
                return;
            }

            const response = await axios.post("/api/feedback", {
                text: feedback
            });

            if (response.status === 200) {
                toast.success("Feedback sent successfully");
                setFeedback("");
                setIsLoading(false);
                setIsOpen(false);
            } else if (response.status === 401) {
                toast.error("Please login to send feedback");
                setIsLoading(false);
            } else {
                toast.error("Failed to send feedback");
                setIsLoading(false);
            }

        } catch (error) {
            console.log("Error sending feedback: ", error);
            toast.error("Failed to send feedback. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-full px-3 py-2 overflow-x-scroll border-b md:overflow-x-hidden border-border md:w-full md:px-5 h-14">
            <TooltipProvider>
                <div className="grid items-start justify-start w-full grid-cols-1 md:grid-cols-2">
                    <div className="relative flex items-center w-full justify-stretch">
                        <div className="flex items-center">
                            <div className="flex items-center gap-x-4">
                                <span className="font-medium">
                                    Language:
                                </span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="flex items-center justify-between font-normal w-[180px]">
                                            {inputLang === "en" ? "English" : inputLang === "es" ? "Spanish" : inputLang === "hi" ? "Hindi" : inputLang === "de" ? "German" : inputLang === "zh" ? "Chinese" : inputLang === "it" ? "Italian" : inputLang === "fr" ? "French" : inputLang === "ar" ? "Arabic" : inputLang === "ja" ? "Japanese" : inputLang === "ko" ? "Korean" : inputLang === "pt" ? "Portuguese" : inputLang === "ru" ? "Russian" : inputLang === "tr" ? "Turkish" : inputLang === "pl" ? "Polish" : inputLang === "nl" ? "Dutch" : inputLang === "sv" ? "Swedish" : inputLang === "da" ? "Danish" : inputLang === "fi" ? "Finnish" : inputLang === "el" ? "Greek" : inputLang === "hu" ? "Hungarian" : inputLang === "id" ? "Indonesian" : "English"}
                                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="max-w-fit" align="start">
                                        <div className="grid w-full grid-cols-2 gap-x-2 md:grid-cols-3">
                                            {languages?.map((lang) => (
                                                <DropdownMenuItem
                                                    key={lang.value}
                                                    onClick={handleLangChange}
                                                    className="w-[140px]"
                                                >
                                                    {lang.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-end w-full">
                        <div className="flex items-center gap-x-2">
                            {outputText?.length > 0 && (
                                <AlertDialog>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger asChild>
                                            <AlertDialogTrigger asChild>
                                                <Button size="icon" variant="ghost">
                                                    <Trash2 className="w-5 h-5" />
                                                </Button>
                                            </AlertDialogTrigger>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            Delete all text
                                        </TooltipContent>
                                    </Tooltip>

                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Are you sure?
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will delete all generated translated text.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handleDeleteText}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}
                            <Dialog open={isOpen} onOpenChange={() => setIsOpen((prev) => !prev)}>
                                <Tooltip delayDuration={0}>
                                    <TooltipTrigger asChild>
                                        <DialogTrigger asChild>
                                            <Button size="icon" variant="ghost">
                                                <MessageSquareText className="w-5 h-5" />
                                            </Button>
                                        </DialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Give Feedback
                                    </TooltipContent>
                                </Tooltip>

                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Give your feedback
                                        </DialogTitle>
                                        <DialogDescription>
                                            We are always looking for ways to improve our service. Please let us know what you think.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex flex-col gap-y-4">
                                        <Textarea
                                            value={feedback}
                                            onChange={(e) => setFeedback(e.target.value)}
                                            placeholder="Enter your feedback here..."
                                            className="w-full outline-none resize-none"
                                        />
                                        <DialogFooter className="flex flex-row items-center justify-end w-full gap-x-4">
                                            <DialogClose asChild>
                                                <Button size="sm" variant="outline">
                                                    Cancel
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                size="sm"
                                                disabled={isLoading}
                                                onClick={handleSendFeedback}
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-5 h-5 mx-4 animate-spin" />
                                                ) : (
                                                    "Send"
                                                )}
                                            </Button>
                                        </DialogFooter>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </TooltipProvider>
        </div>
    )
}

export default Topbar