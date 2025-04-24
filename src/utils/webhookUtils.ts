
import { Contract } from "@/types";
import { toast } from "sonner";

export async function triggerContractWebhook(contract: Contract): Promise<boolean> {
  try {
    console.log("Disparando webhook com os dados:", contract);
    
    const webhookData = {
      user_id: contract.user_id,
      contract_id: contract.id,
      ...contract.dados_json,
      data_criacao: contract.data_criacao,
    };
    
    console.log("Payload do webhook:", webhookData);
    
    const response = await fetch('https://webhook.lucasfelix.com/webhook/8d8c0906-9eb9-4657-8d48-5231c1fc1feb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookData),
    });

    const responseStatus = response.status;
    console.log("Resposta do webhook - status:", responseStatus);
    
    try {
      const responseText = await response.text();
      console.log("Resposta do webhook - corpo:", responseText);
    } catch (textError) {
      console.error("Não foi possível ler o corpo da resposta:", textError);
    }

    if (!response.ok) {
      throw new Error(`Webhook request failed with status ${response.status}`);
    }
    
    console.log("Webhook disparado com sucesso!");
    return true;
  } catch (error) {
    console.error('Erro detalhado ao disparar webhook:', error);
    toast.error("Não foi possível notificar o sistema externo sobre o novo contrato.");
    // Even if the webhook fails, we return true so the contract creation process continues
    return false;
  }
}
