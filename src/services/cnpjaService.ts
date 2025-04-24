
import { Company } from "@/types";
import { toast } from 'sonner';

const CNPJA_API_KEY = "050e0940-8a3b-4179-b5a8-347983fbc375-0b09d9d8-33d3-4bcc-bd0d-15b970b7e209";

export const fetchCompanyData = async (cnpj: string): Promise<Company | null> => {
  try {
    // Format CNPJ for API request (remove special characters and get only first 8 digits)
    const formattedCnpj = cnpj.replace(/\D/g, "").substring(0, 8);
    
    console.log(`Fetching company data for CNPJ: ${formattedCnpj}`);
    
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
    console.log("API response:", data);
    
    // Find the main office from the response
    const mainOffice = data.offices?.find(office => office.head === true) || data.offices?.[0];
    
    // Find the first member with role of Sócio-Administrador or just get the first member
    const owner = data.members?.find(m => m.role?.text === "Sócio-Administrador") || data.members?.[0];
    
    // Transform API response to our Company type
    return {
      cnpj: cnpj.replace(/\D/g, ""),
      name: data.name || mainOffice?.alias || "Não disponível",
      ownerName: owner?.person?.name || "Não disponível",
      address: mainOffice ? `${mainOffice.address?.street || ""}, ${mainOffice.address?.number || ""}, ${mainOffice.address?.district || ""}, ${mainOffice.address?.city || ""} - ${mainOffice.address?.state || ""}, ${mainOffice.address?.zip || ""}` : "Não disponível",
      phone: mainOffice?.phones?.[0] || "Não disponível",
    };
  } catch (error) {
    console.error("Error fetching company data:", error);
    toast.error('Erro ao buscar dados da empresa');
    return null;
  }
};
