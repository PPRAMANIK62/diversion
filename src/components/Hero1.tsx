"use client";

import Convertor from "@/components/ui/Convertor";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ParticlesDemo = () => {
  const { theme } = useTheme();
  const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    setColor(theme === "dark" ? "#ffffff" : "#000000");
  }, [theme]);

  return (
    <div className="relative flex min-h-svh w-full flex-col items-center overflow-hidden rounded-lg border border-t-0 bg-black pt-20 md:pt-28 md:shadow-xl">
      <Convertor />
    </div>
  );
};

export default ParticlesDemo;
