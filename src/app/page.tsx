import Footer from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Button69 from "@/components/button69";
import CreateButton from "@/components/createbutton";
import GlowingEffectDemo from "@/components/glowingdemo";
import { TextReveal } from "@/components/infinite";
import LoaderView from "@/components/loaderconverter";
import BlurFade from "@/components/magicui/blur-fade";
import Perks from "@/components/perks";
import Reviews from "@/components/testimonial";
import TextRevealButton from "@/components/textreavel";
import RotatingText from "@/components/ui/RotatingText";
import { Button } from "@/components/ui/button";
import SparklesText from "@/components/ui/sparklestxt";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen w-full overflow-hidden bg-black pt-20">
      <Navbar />
      <div className="mx-auto h-12 w-12">
        <LoaderView />
      </div>

      <main className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Decorative elements */}

        {/* Hero Section */}
        <div className="relative py-40 text-center lg:py-40">
          <h1 className="mt-15 mb-6 bg-gradient-to-r from-pink-600 via-violet-500 to-cyan-300 bg-clip-text text-4xl font-extrabold text-transparent sm:text-5xl lg:text-6xl">
            Enhance Your Productivity With{" "}
            <span className="text-8xl">
              <SparklesText text="CazzAI" />{" "}
            </span>
          </h1>

          <div className="flex justify-center space-x-4">
            <Link href="/features">
              <CreateButton />
            </Link>

            <Link href="/dashboard/content">
              <Button69 />
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className=" " id="features">
          <h1 className="h1 text-center">
            <BlurFade delay={0.1} blur="6px" duration={1} inView>
              <span className="">
                <span className="inline-bloc mb-12 bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-center text-4xl font-bold text-transparent">
                  Services We Provide In{" "}
                  <span>
                    <SparklesText text="CazzAI" />{" "}
                  </span>
                </span>
              </span>
            </BlurFade>
          </h1>
          <div className="align-column-center py-10 text-center">
            <BlurFade delay={0.1} blur="6px" duration={1} inView>
              <RotatingText />
            </BlurFade>
          </div>

          <GlowingEffectDemo />
        </div>

        {/* Benefits Section */}
        <Perks />

        {/* CTA Section */}
        <div className="relative py-20 text-center">
          <div className="animate-spin-slow absolute right-10 top-10">
            <svg
              className="h-20 w-20 text-blue-500 opacity-20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <Reviews />
          <h2 className="mb-8 bg-gradient-to-r from-pink-700 via-purple-500 to-cyan-300 bg-clip-text text-4xl font-bold text-transparent">
            Want to elevate yourself to one step ahead?
          </h2>
          {userId ? (
            <Button
              asChild
              className="transform rounded-full bg-blue-600 from-pink-500 via-purple-500 to-indigo-500 px-10 py-4 text-lg text-white transition duration-300 ease-in-out hover:scale-105 hover:bg-gradient-to-r"
            >
              <Link href="/generate">
                Generate Content Now <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <SignUpButton mode="modal">
              <TextRevealButton />
            </SignUpButton>
          )}
        </div>
        <div className="relative text-center text-2xl"></div>

        <div>
          <div className="relative mb-12 flex w-full flex-col items-center justify-center text-center">
            <div className="flex items-center justify-center bg-white dark:bg-black">
              <TextReveal text="Magic UI will change the way you design." />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Footer />
        </div>

        <div className="hidden h-[20rem] items-center justify-center md:flex lg:h-[20rem]">
          <TextHoverEffect text="CAZZAI" />
        </div>
      </main>
    </div>
  );
}
