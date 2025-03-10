import Link from "next/link";

interface ResumeCardProps {
  score: number;
  summary: string;
  suggestions: string[];
  additional_tips: string;
}

const ResumeCard = ({ content }: { content: ResumeCardProps }) => {
  return (
    <div className="mt-20 space-y-6 rounded-md border border-gray-700 p-4 shadow-xl md:p-6">
      <h1 className="text-2xl font-bold text-white">
        Resume Score:{" "}
        <span
          className={
            content.score > 80
              ? `text-green-500`
              : content.score > 60 && content.score < 80
                ? `text-yellow-500`
                : `text-red-600`
          }
        >
          {content.score}
        </span>
      </h1>
      <h1 className="text-3xl font-bold text-white underline underline-offset-8">
        Overview
      </h1>
      <p className="text-medium text-lg text-white">{content.summary}</p>
      <h1 className="text-3xl font-bold text-white underline underline-offset-8">
        Suggestions
      </h1>
      <ul className="space-y-4">
        {content.suggestions.map((suggestion, index) => (
          <li className="ml-4 list-disc text-white" key={index}>
            {suggestion}
          </li>
        ))}
      </ul>
      <div>
        <h1 className="text-3xl font-bold text-white underline underline-offset-8">
          Additional Tips
        </h1>
        <p className="text-medium mt-6 text-lg text-white">
          {content.additional_tips}
        </p>
      </div>
      <div>
        <div className="space-y-4">
          {content.score > 75 ? (
            <p className="text-lg font-medium text-green-500">
              Looks like you are on a good track. To brush up your knowledge, we
              suggest you to start learning with our AI powered learning
              platform.
            </p>
          ) : (
            <p className="text-lg font-medium text-blue-500">
              Oops!! Score seems poor. Try to make it as professional as
              possible. CazzAI would like to recommend you to try out our AI
              powered Resume builder. Keep Growing 🚀. Keep HUSTLING 🎯.
            </p>
          )}
          <div className="flex gap-4">
            <Link href={"https://www.youtube.com/"}>
              <button className="mt-6 rounded bg-blue-600 from-pink-400 via-purple-500 to-indigo-700 px-4 py-2 font-bold text-white hover:bg-gradient-to-r hover:text-white">
                Start Learning
              </button>
            </Link>
            <Link href={"/"}>
              <button className="mt-6 rounded bg-blue-600 from-pink-400 via-purple-500 to-indigo-700 px-4 py-2 font-bold text-white hover:bg-gradient-to-r hover:text-white">
                Use CazzAI
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeCard;
