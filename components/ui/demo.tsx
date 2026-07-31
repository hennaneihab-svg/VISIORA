"use client";
import React from "react";
import { WavyBackground } from "@/components/ui/wavy-background";

export function WavyBackgroundDemo() {
  return (
    <WavyBackground className="max-w-4xl mx-auto pb-40" containerClassName="bg-[#030405]">
      <p className="text-2xl md:text-4xl lg:text-7xl text-white font-bold inter-var text-center font-serif">
        Nous façonnons le <span class="text-[#D4141A] italic">cinéma</span> de votre marque
      </p>
      <p className="text-base md:text-lg mt-4 text-gray-400 font-normal inter-var text-center">
        Tirez parti de la puissance du canvas pour créer des expériences immersives et captivantes.
      </p>
    </WavyBackground>
  );
}
