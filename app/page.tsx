"use client";

import { ModeToggle } from "@/components/toggle-mode";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-screen">
        <ModeToggle/> 
        <h1 className="text-7xl">DG Metrics</h1>
    </div>  
  );
}
