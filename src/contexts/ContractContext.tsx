
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
  addContract: (data: Omit<Contract["dados_json"], "dataConfirmed"> & { dataConfirmed: boolean }) => Promise<void>;
  getContractById: (id: string) => Contract | undefined;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("ContractProvider rendering");
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>(() => {
    console.log("Initializing contracts from localStorage");
    try {
      const storedContracts = localStorage.getItem("contracts");
      if (storedContracts) {
        const parsed = JSON.parse(storedContracts);
        console.log("Loaded contracts from localStorage:", parsed);
        return parsed;
      }
    } catch (error) {
      console.error("Failed to parse stored contracts:", error);
    }
    return [];
  });

  const addContract = async (data: Omit<Contract["dados_json"], "dataConfirmed"> & { dataConfirmed: boolean }) => {
    console.log("addContract called with data:", data);
    
    if (!user) {
      console.error("User not logged in");
      toast.error("É necessário estar logado para gerar contratos.");
      throw new Error("User not logged in");
    }

    try {
      console.log("Creating new contract with user_id:", user.id);
      
      const newContract: Contract = {
        id: Date.now().toString(),
        user_id: user.id,
        dados_json: data,
        data_criacao: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log("Saving contract to local storage");
      
      // Guardar no estado e localStorage
      const updatedContracts = [...contracts, newContract];
      setContracts(updatedContracts);
      localStorage.setItem("contracts", JSON.stringify(updatedContracts));
      
      console.log("Contract saved successfully, now triggering webhook");
      
      // Disparar webhook
      try {
        const webhookSuccess = await triggerContractWebhook(newContract);
        
        if (webhookSuccess) {
          console.log("Webhook triggered successfully");
          toast.success('Contrato gerado e sistema externo notificado com sucesso!');
        } else {
          console.warn("Webhook trigger failed");
          toast.warning('Contrato gerado com sucesso, mas houve um problema na notificação do sistema externo.');
        }
      } catch (webhookError) {
        console.error("Error in webhook process:", webhookError);
        // We still consider the contract creation successful even if webhook fails
        toast.warning('Contrato gerado com sucesso, mas houve um problema na notificação do sistema externo.');
      }
      
      return;
    } catch (error) {
      console.error("Erro ao adicionar contrato:", error);
      toast.error("Ocorreu um erro ao gerar o contrato. Por favor, tente novamente.");
      throw error;
    }
  };

  const getContractById = (id: string) => {
    console.log("Getting contract by id:", id, "from contracts:", contracts);
    return contracts.find((contract) => contract.id === id);
  };

  const contextValue = { contracts, addContract, getContractById };
  console.log("ContractContext value:", contextValue);

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => {
  const context = useContext(ContractContext);
  if (context === undefined) {
    console.error("useContract was called outside of ContractProvider");
    throw new Error("useContract must be used within a ContractProvider");
  }
  return context;
};
