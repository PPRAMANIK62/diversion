import DashboardCards from "@/components/layout/DashboardCards";
import { Navbar } from "@/components/Navbar";

const ResumePage = () => {
  return (
    <>
      <div className="h-20 bg-black text-gray-100">
        <Navbar />
      </div>
      <div className="flex w-full flex-col gap-8 md:p-5">
        <div className="mb-10 rounded-lg bg-gradient-to-tl from-green-300 via-blue-500 to-purple-600 p-10">
          <div className="flex flex-col items-start justify-start gap-x-10 gap-y-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-white">
                create your resume.
              </h2>
              <h2 className="text-gray-200">
                Create your resume with our easy-to-use AI resume builder. Also
                download your resume in PDF format.
              </h2>
            </div>
          </div>
        </div>
        <DashboardCards />
      </div>
    </>
  );
};

export default ResumePage;
