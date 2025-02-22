import { currentUser } from "@clerk/nextjs/server";
import GradualSpacing from "./ui/gradual-separate";

const Welcome = async () => {
  const user = await currentUser();

  return (
    <div className="group relative overflow-hidden rounded-lg bg-gradient-to-l from-cyan-300 via-blue-500 to-purple-500 p-6 text-white transition-all hover:shadow md:p-8 md:py-12">
      <h1 className="mb-2 text-3xl font-bold">
        Heyy{" "}
        <span>
          <GradualSpacing
            className="text-center text-4xl font-bold tracking-[-0.11em] text-white md:text-6xl md:leading-[5rem]"
            text={
              user?.firstName ?? user?.lastName ?? user?.fullName ?? "Friend"
            }
          />
        </span>{" "}
        !👋
      </h1>
      <p className="text-lg text-white">
        Hey there:) Welcome to the AI powered platform for all your needs.
      </p>
    </div>
  );
};

export default Welcome;
