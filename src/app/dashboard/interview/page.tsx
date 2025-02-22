import AddNewInterview from "@/components/interview/add-new-interview";
import { Navbar } from "@/components/Navbar";

const InterviewDashboard = () => {
  return (
    <div>
      <div className="h-20 bg-black text-gray-100">
        <Navbar />
      </div>
      <div className="mb-10 rounded-lg bg-gradient-to-tl from-green-300 via-blue-500 to-purple-600 p-10">
        <div className="flex flex-col items-start justify-start gap-x-10 gap-y-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="mb-2 text-3xl font-bold text-white">
              mock interview.
            </h2>
            <h2 className="text-gray-200">
              Create and Start your AI Mock Interview
            </h2>
          </div>
          <AddNewInterview />
        </div>
      </div>
      {/* <InterviewList /> */}
    </div>
  );
};

export default InterviewDashboard;
