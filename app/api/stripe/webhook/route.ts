import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js'; // Usamos o admin client direto aqui

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

// Cliente Supabase com poderes de ADMIN (Service Role) para escrever na tabela profiles sem restrição
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    // Valida se a chamada veio mesmo do Stripe
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Processa o evento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Recupera o ID do usuário que enviamos no passo anterior
    const userId = session.metadata?.userId;

    if (userId) {
      console.log(`💰 Pagamento recebido de ${userId}. Liberando acesso...`);
      
      // Atualiza o banco de dados
      await supabaseAdmin
        .from('profiles')
        .update({ 
            is_subscriber: true,
            stripe_customer_id: session.customer as string
        })
        .eq('id', userId);
    }
  }

  // Você pode adicionar lógica para 'customer.subscription.deleted' para remover o acesso se parar de pagar

  return NextResponse.json({ received: true });
}