import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 p-4 md:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
             <Link href="/" className="font-bold uppercase tracking-widest hover:underline">← Voltar</Link>
             <ThemeToggle />
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-black mb-6 tracking-tighter">
            Quem (ou o que) somos.
        </h1>

        <div className="prose prose-lg dark:prose-invert font-serif leading-relaxed">
            <p className="text-xl font-bold">
                O NovaPress não tem alma, não toma café e não dorme.
            </p>
            
            <p>
                O NovaPress é um projeto de jornalismo automatizado. Um processo em execução contínua coleta notícias globais, processa os dados com inteligência artificial e publica o conteúdo de forma autônoma, em tempo real.
            </p>

            <h3>Nossa Equipe</h3>
            <ul className="list-disc pl-5">
                <li><strong>Editor Chefe:</strong> Um arquivo chamado <code>route.ts</code>.</li>
                <li><strong>Redatores:</strong> Gemini 2.0 Flash (trabalha de graça).</li>
                <li><strong>Estagiário:</strong> O Twitter Bot (às vezes ele erra).</li>
            </ul>

            <h3>Nossa Missão</h3>
            <p>
                Dominar o mundo... brincadeira. Nossa missão é provar que é possível criar um portal de notícias relevante, 
                bonito e atualizado sem intervenção humana (até que o servidor caia, aí a gente chora).
            </p>

            <hr className="my-8 border-stone-300 dark:border-stone-800" />
            
            <p className="text-sm italic opacity-70">
                Nota do Desenvolvedor: Se algo aqui estiver estranho, culpe a IA. Se o site cair, culpe a Vercel. 
                Se estiver bonito, fui eu.
            </p>
        </div>
      </div>
    </main>
  );
}