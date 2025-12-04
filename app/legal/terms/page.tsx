import Link from "next/link";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 p-4 md:p-12">
      <div className="max-w-2xl mx-auto font-serif">
        <Link href="/" className="font-sans font-bold uppercase tracking-widest hover:underline text-xs mb-8 block">← Voltar para Home</Link>
        
        <h1 className="text-4xl font-black mb-8">Termos de Uso (Sério, mas nem tanto)</h1>

        <div className="space-y-6">
            <section>
                <h2 className="text-xl font-bold mb-2">1. Aceitação</h2>
                <p>Ao acessar o NovaPress, você concorda que está lendo notícias escritas por um robô. Se ele alucinar e disser que capivaras voam, use o bom senso.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-2">2. Precisão dos Fatos</h2>
                <p>Nossa IA se esforça, mas às vezes ela bebe óleo demais. Não use nossas notícias como base para investimentos financeiros, cirurgias cardíacas ou apostas em corrida de cavalo.</p>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-2">3. Direitos Autorais</h2>
                <p>As notícias originais pertencem às suas fontes. Nós apenas resumimos e curamos. Se você é dono de uma fonte e está bravo, mande um email que nosso robô lerá (talvez).</p>
            </section>
            
            <section>
                <h2 className="text-xl font-bold mb-2">4. Garantias</h2>
                <p>Garantimos que este site foi feito com muito café e poucas horas de sono. Nenhuma outra garantia é oferecida.</p>
            </section>
        </div>
      </div>
    </main>
  );
}