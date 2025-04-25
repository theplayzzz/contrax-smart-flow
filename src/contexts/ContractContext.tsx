
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
        console.log("Fetching contracts for user:", user);
        console.log("User ID type:", typeof user.id);
        console.log("User ID value:", user.id);
        
        const { data, error } = await supabase
          .from('contracts')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error loading contracts - detailed error:', error);
          console.error('Error code:', error.code);
          console.error('Error message:', error.message);
          console.error('Error details:', error.details);
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
      console.log("User ID type:", typeof user.id);
      
      // Convert user.id to a proper UUID string if it's not already
      const userIdString = typeof user.id === 'string' ? user.id : String(user.id);
      console.log("Converted user ID:", userIdString);
      
      // Generate UUID for contract
      const contractId = crypto.randomUUID();
      console.log("Generated contract ID:", contractId);
      
      const newContract: Contract = {
        id: contractId,
        user_id: userIdString,
        dados_json: data,
        data_criacao: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log("Contract to be saved:", newContract);
      console.log("Contract.user_id type:", typeof newContract.user_id);

      // Log the full request details
      console.log("About to send request to Supabase with payload:", JSON.stringify(newContract));

      // Save to Supabase
      const { data: savedData, error } = await supabase
        .from('contracts')
        .insert([newContract])
        .select()
        .single();

      if (error) {
        console.error('Error saving contract to Supabase - detailed error:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        toast.error('Erro ao salvar contrato no banco de dados');
        throw error;
      }

      console.log("Contract saved successfully to Supabase with response:", savedData);
      setContracts(prevContracts => [...prevContracts, savedData]);
      
      // Trigger webhook after successful save
      try {
        const webhookSuccess = await triggerContractWebhook(savedData);
        
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
      console.error("Erro ao adicionar contrato - detailed error:", error);
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
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
