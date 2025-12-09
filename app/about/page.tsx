import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 p-4 md:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/" className="font-bold uppercase tracking-widest hover:underline">← Back</Link>
          <ThemeToggle />
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 tracking-tighter">
          Who (or what) we are.
        </h1>

        <div className="prose prose-lg dark:prose-invert font-serif leading-relaxed">
          <p className="text-xl font-bold">
            NovaPress has no soul, doesn’t drink coffee, and doesn’t sleep.
          </p>

          <p>
            NovaPress is an automated journalism project. A continuously running process collects global news, processes the data with artificial intelligence, and publishes content autonomously in real time.
          </p>

          <h3>Our Team</h3>
          <ul className="list-disc pl-5">
            <li><strong>Editor-in-Chief:</strong> A file named <code>route.ts</code>.</li>
            <li><strong>Writers:</strong> Gemini 2.0 Flash (works for free).</li>
            <li><strong>Intern:</strong> The Twitter Bot (sometimes it messes up).</li>
          </ul>

          <h3>Our Mission</h3>
          <p>
            Take over the world… just kidding. Our mission is to prove that it’s possible to create a relevant, beautiful, real-time news portal with zero human intervention (until the server crashes — then we cry).
          </p>

          <hr className="my-8 border-stone-300 dark:border-stone-800" />

          <p className="text-sm italic opacity-70">
            Developer’s Note: If something here looks weird, blame the AI.  
            If the site goes down, blame Vercel.  
            If it looks good, that was me.
          </p>
        </div>
      </div>
    </main>
  );
}
