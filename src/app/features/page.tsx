import TemplateCard from "@/components/content/TemplateCard";
import { type TEMPLATE } from "@/components/content/TemplateListSection";
import { Navbar } from "@/components/Navbar";
import TextRevealButton from "@/components/textRevealbutton";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LinkedIn from "@/components/ui/LinkedInIcon";
import Welcome from "@/components/Welcome";
import { TEMPLATES } from "@/constants/templates";
import {
  BotMessageSquare,
  Code,
  FileHeart,
  FileUser,
  Loader2,
  MailPlus,
  Speech,
  TableProperties,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  borderColor: string;
}

const featureCards: FeatureCard[] = [
  {
    icon: <Speech size={50} />,
    title: "AI Mock Interview ✨",
    description: "Practice your interview skills with AI feedback.",
    href: "/dashboard/interview",
    borderColor: "border-cyan-500",
  },
  {
    icon: <Speech size={50} />,
    title: "AI Browser ✨",
    description: "Practice your interview skills with AI feedback.",
    href: "/dashboard/browser",
    borderColor: "border-cyan-500",
  },
  {
    icon: <Speech size={50} />,
    title: "Meta AI ✨",
    description: "Practice your interview skills with AI feedback.",
    href: "/dashboard/meta",
    borderColor: "border-cyan-500",
  },
  {
    icon: <Speech size={50} />,
    title: "AI Translator ✨",
    description: "Practice your interview skills with AI feedback.",
    href: "/dashboard/translator",
    borderColor: "border-cyan-500",
  },
  {
    icon: <TableProperties size={50} />,
    title: "AI Forms ✨",
    description: "Create full fledged forms within seconds with AI.",
    href: "/dashboard/forms",
    borderColor: "border-cyan-500",
  },
  {
    icon: <FileHeart size={50} />,
    title: "AI Resume ✨",
    description: "Create your resume with our easy-to-use AI resume builder.",
    href: "/dashboard/resume",
    borderColor: "border-violet-500",
  },
  {
    icon: <BotMessageSquare size={50} />,
    title: "AI Chatbot ✨",
    description: "Talk , discuss and get help from AI Chatbot.",
    href: "/dashboard/chatbot",
    borderColor: "border-blue-500",
  },
  {
    icon: <MailPlus size={50} />,
    title: "AI Emailer ✨",
    description: "Send Emails to multiple persons with AI generated content.",
    href: "/dashboard/emailer",
    borderColor: "border-violet-500",
  },
  {
    icon: <LinkedIn className="size-10" />,
    title: "Top LinkedIn Search ✨",
    description: "Send Emails to multiple persons with AI generated content.",
    href: "/dashboard/toplinkedin",
    borderColor: "border-violet-500",
  },
  {
    icon: <FileUser className="size-10" />,
    title: "AI Resume Analyser ✨",
    description: "Analyze your resume with ATS Score.",
    href: "/dashboard/pages",
    borderColor: "border-violet-500",
  },
  {
    icon: <Code className="size-10" />,
    title: "Code Converter",
    description: "Convert your code to other languages.",
    href: "/dashboard/code-converter",
    borderColor: "border-violet-500",
  },
  {
    icon: <Code className="size-10" />,
    title: "Voice To Text Converter",
    description: "Convert your code to other languages.",
    href: "/dashboard/speech",
    borderColor: "border-violet-500",
  },
  {
    icon: <Code className="size-10" />,
    title: "Text Summary",
    description: "Convert your code to other languages.",
    href: "/dashboard/summary",
    borderColor: "border-violet-500",
  },
  {
    icon: <Code className="size-10" />,
    title: "Pdf to text",
    description: "Convert your code to other languages.",
    href: "/dashboard/pdf-parse",
    borderColor: "border-violet-500",
  },
  {
    icon: <Code className="size-10" />,
    title: "AI File Convertor",
    description: "Convert your code to other languages.",
    href: "/dashboard/fileconvert",
    borderColor: "border-violet-500",
  },
  {
    icon: <Code className="size-10" />,
    title: "AI Analyst",
    description: "Convert your code to other languages.",
    href: "/dashboard/analyst",
    borderColor: "border-violet-500",
  },
  {
    icon: <Code className="size-10" />,
    title: "Text to Speech",
    description: "Convert your code to other languages.",
    href: "/dashboard/text-speech",
    borderColor: "border-violet-500",
  },
];

const FeaturesPage = () => {
  return (
    <>
      <div className="h-20 bg-black text-gray-100">
        <Navbar />
      </div>
      <div
        className="flex w-full flex-col gap-8 md:p-5"
        suppressHydrationWarning
      >
        <Suspense
          fallback={
            <div className="group relative min-h-36 overflow-hidden rounded-lg bg-gradient-to-l from-cyan-300 via-blue-500 to-purple-500 text-white transition-all hover:shadow sm:min-h-52">
              <Loader2 size={50} className="mx-auto mt-20 animate-spin" />
            </div>
          }
        >
          <Welcome />
        </Suspense>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2">
          {featureCards.map((card, index) => (
            <Card
              key={index}
              className={`border ${card.borderColor} shadow transition-all duration-500 hover:-translate-y-1 hover:shadow-md hover:shadow-blue-500/40`}
            >
              <CardHeader className="flex gap-4">
                {card.icon}
                <div>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={card.href}>
                  <TextRevealButton />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="flex flex-col">
          <h2 className="py-2 text-center text-2xl font-semibold text-white md:text-3xl">
            Trending Tools
          </h2>
          <div className="mb-12 grid grid-cols-2 gap-5 py-10 md:grid-cols-3 lg:grid-cols-4">
            {TEMPLATES.slice(0, 8).map((item: TEMPLATE, index) => (
              <TemplateCard {...item} key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturesPage;
