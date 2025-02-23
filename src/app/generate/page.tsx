"use client";
import React from "react";

import {
  createOrUpdateUser,
  getGeneratedContentHistory,
  getUserPoints,
  saveGeneratedContent,
  updateUserPoints,
} from "@/actions/user";
import { Navbar } from "@/components/Navbar";
import { InstagramMock } from "@/components/social-mocks/InstagramMock";
import { LinkedInMock } from "@/components/social-mocks/LinkedInMock";
import { TwitterMock } from "@/components/social-mocks/TwitterMock";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SignInButton, useUser } from "@clerk/nextjs";
import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import {
  Clock,
  Copy,
  Instagram,
  Linkedin,
  Loader2,
  Twitter,
  Upload,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const contentTypes = [
  { value: "twitter", label: "Twitter Thread" },
  { value: "instagram", label: "Instagram Caption" },
  { value: "linkedin", label: "LinkedIn Post" },
];

const MAX_TWEET_LENGTH = 500;
const POINTS_PER_GENERATION = 2;

interface HistoryItem {
  id: number;
  contentType: string;
  prompt: string;
  content: string;
  createdAt: Date;
}

export default function GenerateContent() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  const [contentType, setContentType] = useState(contentTypes[0]!.value);
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<HistoryItem | null>(null);
  const [isUpdatingPoints, setIsUpdatingPoints] = useState(false);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!apiKey) {
      console.error("Gemini API key is not set");
    }
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/");
    } else if (isSignedIn && user) {
      console.log("User loaded:", user);
      void fetchUserPoints();
      void fetchContentHistory();
    }
  }, [isLoaded, isSignedIn, user, router]);

  const fetchUserPoints = async () => {
    if (!user?.id) return;

    try {
      console.log("Fetching points for user:", user.id);
      const points = await getUserPoints(user.id);
      console.log("Fetched points:", points);
      setUserPoints(points);

      if (points === 0) {
        console.log("User has 0 points. Attempting to create/update user.");
        const result = await createOrUpdateUser(
          user.id,
          user.emailAddresses[0]!.emailAddress,
          user.fullName ?? "",
        );

        if (result.success && result.data) {
          setUserPoints(result.data.points);
        } else {
          console.error("Failed to create/update user:", result.error);
          toast.error(result.error ?? "Failed to update user");
        }
      }
    } catch (error) {
      console.error("Error fetching user points:", error);
      toast.error("Failed to fetch user points");
    }
  };

  const fetchContentHistory = async () => {
    if (user?.id) {
      const contentHistory = await getGeneratedContentHistory(user.id);
      setHistory(contentHistory);
    }
  };

  const handleGenerate = async () => {
    if (
      !genAI ||
      !user?.id ||
      userPoints === null ||
      userPoints < POINTS_PER_GENERATION
    ) {
      toast.error("Not enough points or API not configured");
      return;
    }

    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

      let promptText = `Generate ${contentType} content about "${prompt}".`;
      if (contentType === "twitter") {
        promptText +=
          " Provide a thread of 5 tweets, each under 280 characters.";
      }

      let imagePart: Part | null = null;
      if (contentType === "instagram" && image) {
        const reader = new FileReader();
        const imageData = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            if (e.target && typeof e.target.result === "string") {
              resolve(e.target.result);
            } else {
              resolve("");
            }
          };
          reader.readAsDataURL(image);
        });

        const base64Data = imageData.split(",")[1];
        if (base64Data) {
          imagePart = {
            inlineData: {
              data: base64Data,
              mimeType: image.type,
            },
          };
        }
        promptText +=
          " Describe the image and incorporate it into the caption.";
      }

      const parts: (string | Part)[] = [promptText];
      if (imagePart) parts.push(imagePart);

      const result = await model.generateContent(parts);
      const generatedText = result.response.text();

      let content: string[];
      if (contentType === "twitter") {
        content = generatedText
          .split("\n\n")
          .filter((tweet) => tweet.trim() !== "");
      } else {
        content = [generatedText];
      }

      setGeneratedContent(content);

      // Update points
      const pointsResult = await updateUserPoints(
        user.id,
        -POINTS_PER_GENERATION,
      );
      if (!pointsResult.success) {
        throw new Error(pointsResult.error ?? "Failed to update points");
      }

      setUserPoints(pointsResult.data?.points ?? userPoints);

      // Save generated content
      const contentResult = await saveGeneratedContent(
        user.id,
        content.join("\n\n"),
        prompt,
        contentType,
      );

      if (!contentResult.success) {
        throw new Error(contentResult.error ?? "Failed to save content");
      }

      setHistory((prev) => [contentResult.data!, ...prev]);
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate content",
      );
      setGeneratedContent(["An error occurred while generating content."]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryItemClick = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setContentType(item.contentType);
    setPrompt(item.prompt);
    setGeneratedContent(
      item.contentType === "twitter"
        ? item.content.split("\n\n")
        : [item.content],
    );
  };

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
  };

  const renderContentMock = () => {
    if (generatedContent.length === 0) return null;

    switch (contentType) {
      case "twitter":
        return <TwitterMock content={generatedContent} />;
      case "instagram":
        return <InstagramMock content={generatedContent[0]!} />;
      case "linkedin":
        return <LinkedInMock content={generatedContent[0]!} />;
      default:
        return null;
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="rounded-lg bg-[#111111] p-8 text-center shadow-lg">
          <h1 className="mb-4 text-3xl font-bold text-white">
            Welcome to CazzAI
          </h1>
          <p className="mb-6 text-gray-400">
            To start generating amazing content, please sign in or create an
            account.
          </p>
          <SignInButton mode="modal">
            <Button className="bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
              Sign In / Sign Up
            </Button>
          </SignInButton>
          <p className="mt-4 text-sm text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    );
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="container mx-auto mb-8 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left sidebar - History */}
          <div className="h-[calc(100vh-12rem)] overflow-y-auto rounded-2xl bg-gray-800 p-6 lg:col-span-1">
            {/* Points display */}
            <div className="mb-8 flex items-center justify-between rounded-2xl bg-gray-800">
              <div className="flex items-center">
                <Zap className="mr-3 h-8 w-8 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Available Points</p>
                  <p className="text-2xl font-bold text-yellow-400">
                    {userPoints ?? "Loading..."}
                  </p>
                </div>
              </div>
              <Button
                className="rounded-full bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                asChild
              >
                <Link href="/pricing">Get More Points</Link>
              </Button>
            </div>

            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-2xl font-semibold text-blue-400">History</h2>
              <Clock className="h-6 w-6 text-blue-400" />
            </div>
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="cursor-pointer rounded-xl bg-gray-700 p-4 transition-colors hover:bg-gray-600"
                  onClick={() => handleHistoryItemClick(item)}
                >
                  <div className="mb-2 flex items-center">
                    {item.contentType === "twitter" && (
                      <Twitter className="mr-2 h-5 w-5 text-blue-400" />
                    )}
                    {item.contentType === "instagram" && (
                      <Instagram className="mr-2 h-5 w-5 text-pink-400" />
                    )}
                    {item.contentType === "linkedin" && (
                      <Linkedin className="mr-2 h-5 w-5 text-blue-600" />
                    )}
                    <span className="text-sm font-medium">
                      {item.contentType}
                    </span>
                  </div>
                  <p className="truncate text-sm text-gray-300">
                    {item.prompt}
                  </p>
                  <div className="mt-2 flex items-center text-xs text-gray-400">
                    <Clock className="mr-1 h-3 w-3" />
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Generated content display */}
            {(selectedHistoryItem ?? generatedContent.length > 0) && (
              <div className="space-y-4 rounded-2xl bg-gray-800 p-6">
                <h2 className="text-2xl font-semibold text-blue-400">
                  {selectedHistoryItem ? "History Item" : "Generated Content"}
                </h2>
                {contentType === "twitter" ? (
                  <div className="space-y-4">
                    {(selectedHistoryItem
                      ? selectedHistoryItem.content.split("\n\n")
                      : generatedContent
                    ).map((tweet, index) => (
                      <div
                        key={index}
                        className="relative rounded-xl bg-gray-700 p-4"
                      >
                        <ReactMarkdown className="prose-invert prose mb-2 max-w-none text-sm">
                          {tweet}
                        </ReactMarkdown>
                        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                          <span>
                            {tweet.length}/{MAX_TWEET_LENGTH}
                          </span>
                          <Button
                            onClick={() => copyToClipboard(tweet)}
                            className="rounded-full bg-gray-600 p-2 text-white transition-colors hover:bg-gray-500"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl bg-gray-700 p-4">
                    <ReactMarkdown className="prose-invert prose max-w-none text-sm">
                      {selectedHistoryItem
                        ? selectedHistoryItem.content
                        : generatedContent[0]}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            )}

            {/* Content preview */}
            {generatedContent.length > 0 && (
              <div className="rounded-2xl bg-gray-800 p-6">
                <h2 className="mb-4 text-2xl font-semibold text-blue-400">
                  Preview
                </h2>
                {renderContentMock()}
              </div>
            )}
          </div>

          {/* Main content area */}
          <div className="space-y-6 lg:col-span-1">
            {/* Content generation form */}
            <div className="space-y-6 rounded-2xl bg-gray-800 p-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Content Type
                </label>
                <Select
                  onValueChange={setContentType}
                  defaultValue={contentType}
                >
                  <SelectTrigger className="w-full rounded-xl border-none bg-gray-700">
                    <SelectValue placeholder="Select content type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center">
                          {type.value === "twitter" && (
                            <Twitter className="mr-2 h-4 w-4 text-blue-400" />
                          )}
                          {type.value === "instagram" && (
                            <Instagram className="mr-2 h-4 w-4 text-pink-400" />
                          )}
                          {type.value === "linkedin" && (
                            <Linkedin className="mr-2 h-4 w-4 text-blue-600" />
                          )}
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="prompt"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  Prompt
                </label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your prompt here..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  className="w-full resize-none rounded-xl border-none bg-gray-700"
                />
              </div>

              {contentType === "instagram" && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">
                    Upload Image
                  </label>
                  <div className="flex items-center space-x-3">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex cursor-pointer items-center justify-center rounded-xl bg-gray-700 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-600"
                    >
                      <Upload className="mr-2 h-5 w-5" />
                      <span>Upload Image</span>
                    </label>
                    {image && (
                      <span className="text-sm text-gray-400">
                        {image.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
                  {error}
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={
                  isLoading ||
                  isUpdatingPoints ||
                  isSavingContent ||
                  !prompt ||
                  userPoints === null ||
                  userPoints < POINTS_PER_GENERATION
                }
                className="w-full rounded-xl bg-blue-600 py-3 text-white transition-colors hover:bg-blue-700"
              >
                {isLoading || isUpdatingPoints || isSavingContent ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {isLoading
                      ? "Generating..."
                      : isUpdatingPoints
                        ? "Updating points..."
                        : "Saving content..."}
                  </>
                ) : (
                  `Generate Content (${POINTS_PER_GENERATION} points)`
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
