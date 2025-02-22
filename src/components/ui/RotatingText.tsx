"use client";
import "@/styles/RotatingText.css";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const words = [
  "LinkedIn Post",
  "Code Converter",
  "AI Mock Interview",
  "AI Form",
  "Twitter Threads",
  "AI Code Writer",
  "AI Code explainer",
  "AI Emailer",
  "AI Resume",
  "Text Improver",
  "Explain Code",
  "Resume Analyzer",
  "AI Blog",
  "AI Chatbot",
  "AI Summary",
  "Youtube Tags",
  "SEO Optimization",
  "Insta Post Idea",
  "Insta Post Generator",
  "Code Bug Detector",
  "Tagline Generator",
];

const colors = [
  "#4a90e2", // Soft blue
  "#5e72e4", // Royal blue
  "#6c5ce7", // Soft purple
  "#8854d0", // Medium purple
  "#3498db", // Light blue
  "#00b894", // Teal
  "#20bf6b", // Soft green
  "#26de81", // Mint green
  "#2bcbba", // Sea green
  "#45aaf2", // Sky blue
  "#4b7bec", // Clear blue
  "#778ca3", // Steel blue
  "#9b59b6", // Muted purple
  "#00cec9", // Robin's egg blue
  "#48dbfb", // Fresh blue
  "#0abde3", // Blue grotto
  "#2d98da", // Medium blue
  "#45aaf2", // Light blue
  "#4b7bec", // Royal blue
  "#5352ed", // Bright blue
  "#3867d6", // Ocean blue
];

const RotatingText = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  const measureTextWidth = (text: string) => {
    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.whiteSpace = "nowrap";
    tempDiv.style.visibility = "hidden";
    tempDiv.style.fontSize = "inherit";
    tempDiv.style.fontFamily = "inherit";
    tempDiv.style.fontWeight = "inherit";
    tempDiv.textContent = text;
    document.body.appendChild(tempDiv);
    const width = tempDiv.offsetWidth;
    document.body.removeChild(tempDiv);
    return width;
  };

  useEffect(() => {
    // Update the width when the word changes
    if (textRef.current && containerRef.current) {
      const currentText = words[currentWordIndex];
      const measuredWidth = measureTextWidth(currentText!);
      setContainerWidth(measuredWidth + 40); // Add padding to the width
    }
  }, [currentWordIndex]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="rotatingTextContainer"
      style={{
        backgroundColor: colors[colorIndex],
        width: containerWidth
          ? `${Math.max(containerWidth + 720, 200)}px`
          : "auto",
      }}
    >
      <div ref={textRef} className="rotatingTextContent">
        <AnimatePresence mode="wait">
          <motion.p
            key={words[currentWordIndex]}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {words[currentWordIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RotatingText;
