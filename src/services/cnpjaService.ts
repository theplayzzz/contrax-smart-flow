
import { CNPJAResponse, Company } from "@/types";
import { toast } from 'sonner';

const CNPJA_API_KEY = "050e0940-8a3b-4179-b5a8-347983fbc375-0b09d9d8-33d3-4bcc-bd0d-15b970b7e209";

export const fetchCompanyData = async (cnpj: string): Promise<Company | null> => {
  try {
    // Format CNPJ for API request (remove special characters)
    const formattedCnpj = cnpj.replace(/\D/g, "");
    
    const response = await fetch(`https://api.cnpja.com/company/${formattedCnpj}`, {
      headers: {
        Authorization: CNPJA_API_KEY,
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        toast.error('CNPJ não encontrado');
      } else {
        toast.error('Erro ao consultar CNPJ');
      }
      return null;
    }
    
    const data = await response.json();
    
    // Transform API response to our Company type
    return {
      cnpj: formattedCnpj,
      name: data.razao_social || data.nome_fantasia,
      ownerName: data.socios?.[0]?.nome || "Não disponível",
      address: `${data.logradouro}, ${data.numero}${data.complemento ? ', ' + data.complemento : ''}, ${data.bairro}, ${data.municipio} - ${data.uf}, ${data.cep}`,
      phone: data.telefone1 || "Não disponível",
    };
  } catch (error) {
    console.error("Error fetching company data:", error);
    toast.error('Erro ao buscar dados da empresa');
    return null;
  }
};

