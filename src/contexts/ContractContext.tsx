
import React, { createContext, useContext, useState, useEffect } from "react";
import { Contract } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from 'sonner';
import { triggerContractWebhook } from "@/utils/webhookUtils";
import { supabase } from "@/integrations/supabase/client";

interface ContractContextType {
  contracts: Contract[];
  addContract: (data: Omit<Contract["dados_json"], "dataConfirmed"> & { dataConfirmed: boolean }) => Promise<void>;
  getContractById: (id: string) => Contract | undefined;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("ContractProvider rendering");
  const { user } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);

  // Load contracts from Supabase on mount and when user changes
  useEffect(() => {
    const loadContracts = async () => {
      if (!user) {
        setContracts([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('contracts')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error loading contracts:', error);
          toast.error('Erro ao carregar contratos');
          return;
        }

        console.log('Loaded contracts from Supabase:', data);
        setContracts(data || []);
      } catch (error) {
        console.error('Error in loadContracts:', error);
        toast.error('Erro ao carregar contratos');
      }
    };

    loadContracts();
  }, [user]);

  const addContract = async (data: Omit<Contract["dados_json"], "dataConfirmed"> & { dataConfirmed: boolean }) => {
    console.log("addContract called with data:", data);
    
    if (!user) {
      console.error("User not logged in");
      toast.error("É necessário estar logado para gerar contratos.");
      throw new Error("User not logged in");
    }

    try {
      console.log("Creating new contract with user_id:", user.id);
      
      // Generate UUID for contract
      const contractId = crypto.randomUUID();
      
      const newContract: Contract = {
        id: contractId,
        user_id: user.id,
        dados_json: data,
        data_criacao: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Save to Supabase
      const { error } = await supabase
        .from('contracts')
        .insert(newContract);

      if (error) {
        console.error('Error saving contract to Supabase:', error);
        toast.error('Erro ao salvar contrato no banco de dados');
        throw error;
      }

      console.log("Contract saved successfully to Supabase, now updating local state");
      setContracts(prevContracts => [...prevContracts, newContract]);
      
      // Trigger webhook after successful save
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
