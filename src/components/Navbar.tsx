"use client";
import Link from "next/link";
import Prism from "@/components/prism"
import {
  SignInButton,
  SignUpButton,
  UserButton,
  SignedOut,
  SignedIn,
  useAuth,
} from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import SparklesText from "@/components/ui/sparklestxt";
import GradientFillButton from "@/components/fillbutton";
import {InteractiveHoverButton} from "@/components/intbutton";

export function Navbar() {
  const { userId } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900/80 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-8 py-4 sm:py-6">
        <div className="flex flex-wrap justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-1 space-x-2">
            <div className="mx-auto h-12 w-12 relative">
              <Prism />
            </div>
              <span className="text-3xl">
                <SparklesText text="CazzAI" />{" "}
              </span>
            </Link>
          </div>
          <button
            className="sm:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <div
            className={`w-full sm:w-auto ${
              isMenuOpen ? "block" : "hidden"
            } sm:block mt-4 sm:mt-0`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8">
              {[
                "Features",
                "Pricing",
                "Docs",
                "Contents",
              ].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors py-2 sm:py-0 relative group"
                >
                  {item}
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-pink-600 via-violet-500 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
              ))}
              {userId && (
                <Link
                  href="/generate"
                  className="text-gray-300 hover:text-white transition-colors py-2 sm:py-0 relative group"
                >
                  Dashboard
                  <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-gradient-to-r from-pink-600 via-violet-500 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
                </Link>
              )}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-gray-300 hover:text-white transition-colors mt-2 sm:mt-0">
                    <InteractiveHoverButton>Sign In</InteractiveHoverButton>
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="">
                    <GradientFillButton />
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
