import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 p-4 md:p-12">
      <div className="max-w-2xl mx-auto font-serif">
        <Link
          href="/"
          className="font-sans font-bold uppercase tracking-widest hover:underline text-xs mb-8 block"
        >
          ← Back to Home
        </Link>

        <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>

        <div className="space-y-6">
          {/* TL;DR */}
          <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Summary (TL;DR)</h2>
            <p className="text-lg font-bold">
              We collect only the minimum necessary data for the site to work,
              always respecting your privacy.
            </p>
          </div>

          {/* Data Collection */}
          <section>
            <h2 className="text-xl font-bold mb-2">Data Collection</h2>
            <p>
              The data collected is strictly limited to what is necessary for
              these features to function properly.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-bold mb-2">Cookies</h2>
            <p>
              We only use essential cookies, such as those responsible for saving
              your display preferences (light or dark mode).  
              We do not use tracking cookies for advertising or external monitoring.
            </p>
          </section>

          {/* LGPD / GDPR */}
          <section>
            <h2 className="text-xl font-bold mb-2">LGPD / GDPR</h2>
            <p>
              NovaPress follows the principles of the Brazilian General Data
              Protection Law (LGPD) and the General Data Protection Regulation (GDPR).  
              You can browse safely, knowing that your data is never sold, shared,
              or used for abusive purposes.
            </p>
          </section>

          {/* Updates */}
          <section>
            <h2 className="text-xl font-bold mb-2">Updates to This Policy</h2>
            <p>
              This policy may be updated as new features are added to the project,
              including login systems, comments, or content personalization.  
              Whenever there are major changes, this page will be updated.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
