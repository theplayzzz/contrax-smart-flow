
import React, { createContext, useContext, useState } from "react";
import { 
  Contract, 
  Company, 
  ContractType, 
  CommercialTeam, 
  BusinessSegment,
  ProjectType,
  LeadSource,
  PaymentMethod,
  ContractDuration
} from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from 'sonner';
import { triggerContractWebhook } from "@/utils/webhookUtils";

interface ContractContextType {
  contracts: Contract[];
  addContract: (data: Omit<Contract["dados_json"], "dataConfirmed"> & { dataConfirmed: boolean }) => void;
  getContractById: (id: string) => Contract | undefined;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>(() => {
    const storedContracts = localStorage.getItem("contracts");
    if (storedContracts) {
      try {
        return JSON.parse(storedContracts);
      } catch (error) {
        console.error("Failed to parse stored contracts:", error);
        return [];
      }
    }
    return [];
  });

  const addContract = async (data: Omit<Contract["dados_json"], "dataConfirmed"> & { dataConfirmed: boolean }) => {
    if (!user) {
      toast.error("É necessário estar logado para gerar contratos.");
      return;
    }

    try {
      const newContract: Contract = {
        id: Date.now().toString(),
        user_id: user.id,
        dados_json: data,
        data_criacao: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Guardar no estado e localStorage
      const updatedContracts = [...contracts, newContract];
      setContracts(updatedContracts);
      localStorage.setItem("contracts", JSON.stringify(updatedContracts));
      
      // Disparar webhook
      const webhookSuccess = await triggerContractWebhook(newContract);
      
      if (webhookSuccess) {
        toast.success('Contrato gerado e sistema externo notificado com sucesso!');
      } else {
        toast.success('Contrato gerado com sucesso, mas houve um problema na notificação do sistema externo.');
      }
    } catch (error) {
      console.error("Erro ao adicionar contrato:", error);
      toast.error("Ocorreu um erro ao gerar o contrato. Por favor, tente novamente.");
    }
  };

  const getContractById = (id: string) => {
    return contracts.find((contract) => contract.id === id);
  };

  return (
    <ContractContext.Provider value={{ contracts, addContract, getContractById }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
