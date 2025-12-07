import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 p-4 md:p-12">
      <div className="max-w-2xl mx-auto font-serif">
        <Link
          href="/"
          className="font-sans font-bold uppercase tracking-widest hover:underline text-xs mb-8 block"
        >
          ← Voltar para Home
        </Link>

        <h1 className="text-4xl font-black mb-8">Política de Privacidade</h1>

        <div className="space-y-6">
          {/* TL;DR */}
          <div className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Resumo (TL;DR)</h2>
            <p className="text-lg font-bold">
              Coletamos apenas o mínimo necessário para o funcionamento do site,
              com total respeito à sua privacidade.
            </p>
          </div>

          {/* Coleta de Dados */}
          <section>
            <h2 className="text-xl font-bold mb-2">Coleta de Dados</h2>
            <p>
              Os dados coletados são apenas os estritamente
              necessários para o funcionamento desses recursos.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-xl font-bold mb-2">Cookies</h2>
            <p>
              Utilizamos apenas cookies essenciais, como os responsáveis por
              salvar suas preferências de visualização (modo claro ou escuro).
              Não utilizamos cookies de rastreamento para fins publicitários ou
              de monitoramento externo.
            </p>
          </section>

          {/* LGPD / GDPR */}
          <section>
            <h2 className="text-xl font-bold mb-2">LGPD / GDPR</h2>
            <p>
              O NovaPress segue os princípios da Lei Geral de Proteção de Dados
              (LGPD) e do Regulamento Geral de Proteção de Dados (GDPR). Você pode
              navegar com segurança, sabendo que seus dados não são vendidos,
              repassados ou utilizados para fins abusivos.
            </p>
          </section>

          {/* Atualizações */}
          <section>
            <h2 className="text-xl font-bold mb-2">Atualizações desta Política</h2>
            <p>
              Esta política pode ser atualizada conforme novas funcionalidades
              forem adicionadas ao projeto, incluindo sistemas de login,
              comentários ou personalização de conteúdo. Sempre que houver
              mudanças importantes, esta página será atualizada.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
