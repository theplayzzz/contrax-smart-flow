
export async function triggerContractWebhook(contract: Contract) {
  try {
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
      throw new Error('Webhook request failed');
    }

    return true;
  } catch (error) {
    console.error('Error triggering webhook:', error);
    return false;
  }
}
