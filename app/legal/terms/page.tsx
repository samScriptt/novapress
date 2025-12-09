import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 p-4 md:p-12">
      <div className="max-w-2xl mx-auto font-serif">
        <Link
          href="/"
          className="font-sans font-bold uppercase tracking-widest hover:underline text-xs mb-8 block"
        >
          ← Back to Home
        </Link>
        
        <h1 className="text-4xl font-black mb-8">Terms of Use (Serious, but not too much)</h1>

        <div className="space-y-6">
            <section>
                <h2 className="text-xl font-bold mb-2">1. Acceptance</h2>
                <p>
                    By accessing NovaPress, you agree that you’re reading news written by a robot.  
                    If it hallucinates and tells you that capybaras can fly, please use common sense.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-2">2. Accuracy of Information</h2>
                <p>
                    Our AI tries its best, but sometimes it drinks too much oil.  
                    Do not use our news as a basis for financial investments, heart surgeries,  
                    or betting on horse races.
                </p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-2">3. Copyright</h2>
                <p>
                    Original news articles belong to their respective sources.  
                    We only summarize and curate.  
                    If you own a source and you're upset, send us an email and our robot will read it (maybe).
                </p>
            </section>
            
            <section>
                <h2 className="text-xl font-bold mb-2">4. Warranties</h2>
                <p>
                    We guarantee that this site was built with a lot of coffee and very few hours of sleep.  
                    No other warranties are provided.
                </p>
            </section>
        </div>
      </div>
    </main>
  );
}
