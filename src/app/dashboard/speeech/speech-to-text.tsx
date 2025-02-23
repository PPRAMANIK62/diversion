"use client";

import "regenerator-runtime/runtime";

import { useState } from "react";
import { BiSolidCopyAlt } from "react-icons/bi";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { RiResetLeftFill } from "react-icons/ri";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";

const SpeechToText = () => {
  const [copyTxt, setCopyTxt] = useState("");
  const [isCopied, setCopied] = useClipboard(copyTxt);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  const stopListening = () => SpeechRecognition.stopListening();

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div className="h-full text-center">
      <h1 className="text-black">Speech to Text Converter</h1>
      <p className="">
        Note: To copy written text, first click the white board after clicking
        Stop.
      </p>
      <div
        className="w-100 mb-4 mt-6 h-64 rounded-md bg-black pb-32 text-white"
        onClick={() => setCopyTxt(transcript)}
      >
        {transcript || "Click Start and speak..."}
      </div>
      <div className="space-x-4">
        <button onClick={startListening}>
          <BsFillMicFill className="mr-2 inline" />
          Start
        </button>
        <button onClick={stopListening}>
          <BsFillMicMuteFill className="mr-2 inline" />
          Stop
        </button>
        <button onClick={setCopied}>
          <BiSolidCopyAlt className="mr-2 inline" />
          {isCopied ? "Copied" : "Copy to clipboard"}
        </button>
        <button onClick={resetTranscript}>
          <RiResetLeftFill className="mr-2 inline" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default SpeechToText;
