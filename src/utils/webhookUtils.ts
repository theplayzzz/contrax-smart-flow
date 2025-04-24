
import { Contract } from "@/types";
import { toast } from "sonner";

export async function triggerContractWebhook(contract: Contract) {
  try {
    console.log("Disparando webhook com os dados:", contract);
    
    const response = await fetch('https://webhook.lucasfelix.com/webhook/8d8c0906-9eb9-4657-8d48-5231c1fc1feb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: contract.user_id,
        contract_id: contract.id,
        ...contract.dados_json,
        data_criacao: contract.data_criacao,
      }),
    });

    if (!response.ok) {
      console.error("Falha ao disparar webhook. Status:", response.status);
      throw new Error('Webhook request failed');
    }
    
    console.log("Webhook disparado com sucesso!");
    return true;
  } catch (error) {
    console.error('Erro ao disparar webhook:', error);
    toast.error("Não foi possível notificar o sistema externo sobre o novo contrato.");
    return false;
  }
}
