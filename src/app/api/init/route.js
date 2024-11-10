"use client"
import FullSchedule from './components/FullSchedule';  // Note the './' at the start

export default function Home() {
  return (
    <main className="min-h-screen p-4 bg-white">
      <FullSchedule />
    </main>
  );
}