
import { CNPJAResponse, Company } from "@/types";
import { toast } from 'sonner';

// In a real app, you would use your API key
const CNPJA_API_KEY = "demo-key";

export const fetchCompanyData = async (cnpj: string): Promise<Company | null> => {
  try {
    // Format CNPJ for API request (remove special characters)
    const formattedCnpj = cnpj.replace(/\D/g, "");
    
    // For demo purposes, we'll mock the API response
    // In a production environment, uncomment the fetch code below
    
    /*
    const response = await fetch(`https://api.cnpja.com/office/${formattedCnpj}`, {
      headers: {
        Authorization: CNPJA_API_KEY,
      },
    });
    
    if (!response.ok) {
      throw new Error(`CNPJA API error: ${response.status}`);
    }
    
    const data: CNPJAResponse = await response.json();
    */
    
    // Mock data for demo
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
    
    // Mock response based on CNPJ
    if (formattedCnpj === "12345678000199") {
      // Mock successful response
      return {
        cnpj: formattedCnpj,
        name: "Empresa Demonstração Ltda",
        ownerName: "João Silva",
        address: "Av. Paulista, 1000, São Paulo - SP, 01310-100",
        phone: "(11) 3333-4444",
      };
    } else if (formattedCnpj === "98765432000188") {
      // Another mock response
      return {
        cnpj: formattedCnpj,
        name: "Tecnologia Avançada S.A.",
        ownerName: "Maria Souza",
        address: "Rua das Flores, 500, Rio de Janeiro - RJ, 22000-100",
        phone: "(21) 2222-3333",
      };
    } else {
      // If not a mock CNPJ, return null
      toast.error('CNPJ não encontrado');
      return null;
    }
    
    /* Uncomment for real API integration:
    // Transform API response to our Company type
    return {
      cnpj: data.cnpj.numero,
      name: data.razao_social,
      ownerName: data.socios.length > 0 ? data.socios[0].nome : "Não disponível",
      address: `${data.estabelecimento.tipo_logradouro} ${data.estabelecimento.logradouro}, ${data.estabelecimento.numero} ${data.estabelecimento.complemento ? ', ' + data.estabelecimento.complemento : ''}, ${data.estabelecimento.bairro}, ${data.estabelecimento.municipio} - ${data.estabelecimento.uf}, ${data.estabelecimento.cep}`,
      phone: data.estabelecimento.ddd1 && data.estabelecimento.telefone1 ? 
        `(${data.estabelecimento.ddd1}) ${data.estabelecimento.telefone1}` : 
        "Não disponível",
    };
    */
  } catch (error) {
    console.error("Error fetching company data:", error);
    toast.error('Erro ao buscar dados da empresa');
    return null;
  }
};
