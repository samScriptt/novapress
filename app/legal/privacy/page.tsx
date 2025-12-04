import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 p-4 md:p-12">
      <div className="max-w-2xl mx-auto font-serif">
        <Link href="/" className="font-sans font-bold uppercase tracking-widest hover:underline text-xs mb-8 block">← Voltar para Home</Link>
        
        <h1 className="text-4xl font-black mb-8">Política de Privacidade</h1>

        <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">Resumo TL;DR</h2>
                <p className="text-lg font-bold">Nós não ligamos para os seus dados.</p>
            </div>

            <section>
                <h2 className="text-xl font-bold mb-2">Coleta de Dados</h2>
                <p>Não temos formulário de cadastro, não temos newsletter e não vendemos nada. A única coisa que coletamos é poeira digital nos servidores.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-2">Cookies</h2>
                <p>Preferimos cookies de chocolate. Este site usa apenas o essencial para lembrar se você prefere o modo claro ou escuro (tema). Nenhum cookie rastreador espião.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-2">LGPD / GDPR</h2>
                <p>Como não salvamos quem você é, você já está anônimo. Pode navegar em paz sem medo de receber anúncios de sapatos que você apenas pensou em comprar.</p>
            </section>
        </div>
      </div>
    </main>
  );
}