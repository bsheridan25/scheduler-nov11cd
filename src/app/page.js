"use client"

import FullSchedule from './components/FullSchedule';

export default function Home() {
  console.log("Page is rendering");
  return (
    <main className="min-h-screen p-4 bg-white">
      <FullSchedule />
    </main>
  );
}