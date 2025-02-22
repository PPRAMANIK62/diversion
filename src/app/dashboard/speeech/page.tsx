"use client";
// import { useState } from 'react'
//import styles from './app.module.css'
import { useState } from "react";
import { BiSolidCopyAlt } from "react-icons/bi";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import { RiResetLeftFill } from "react-icons/ri";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import "regenerator-runtime/runtime";

//import { SiConvertio } from "react-icons/si"

const Home = () => {
  const [copyTxt, setCopyTxt] = useState();
  const [isCopied, setCopied] = useClipboard(copyTxt);

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true, language: "en-In" });
  const stopListening = () => SpeechRecognition.stopListening();

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return alert("no browsersupport");
  }

  return (
    <>
      <div className="h-full text-center">
        <h1 className="text-black">Speech to Text Converter</h1>
        <p id="para" className=" ">
          Note: To copy written text, firstly click once on the white board
          after clicking Stop button.
        </p>
        <div
          className="w-100 mb-4 mt-6 h-64 rounded-md bg-black pb-32"
          onClick={() => setCopyTxt(transcript)}
        >
          {transcript}
        </div>
        <div className="">
          <button id="" onClick={startListening}>
            <BsFillMicFill />
            Start
          </button>
          <button onClick={stopListening}>
            <BsFillMicMuteFill />
            Stop
          </button>
          <button onClick={setCopied}>
            <BiSolidCopyAlt />
            {isCopied ? " Copied" : " Copy to clipboard"}
          </button>
          <button className="" onClick={resetTranscript}>
            <RiResetLeftFill />
            Reset
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
