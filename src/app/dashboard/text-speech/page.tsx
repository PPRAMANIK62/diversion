"use client"
import React from 'react'
import Container from "@/components/textSpeech/Container";
import {Navbar} from "@/components/Navbar"
//import type { Metadata } from "next";



const AudioGeneratorPage = () => {
    return (
        <div className="flex  items-center justify-center w-full max-h-[80%] h-full mx-auto mt-12 max-w-7xl px-4  md:px-8">
            <div className=''><Navbar /></div>
            
            <Container />
        </div>
    )
}

export default AudioGeneratorPage