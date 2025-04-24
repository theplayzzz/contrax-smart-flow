
import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from '@supabase/supabase-js';
import { Contract } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from 'sonner';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface ContractContextType {
  contracts: Contract[];
  addContract: (data: Omit<Contract, "id" | "createdAt" | "userId">) => Promise<void>;
  getContractById: (id: string) => Promise<Contract | undefined>;
}

const ContractContext = createContext<ContractContextType | undefined>(undefined);

export const ContractProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);

  useEffect(() => {
    if (user) {
      loadContracts();
    }
  }, [user, isAdmin]);

  const loadContracts = async () => {
    try {
      let query = supabase
        .from('contracts')
        .select('*');

      // If not admin, only fetch user's contracts
      if (!isAdmin) {
        query = query.eq('user_id', user?.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the raw data into Contract objects
      const transformedContracts: Contract[] = data?.map(item => {
        // Assuming data is stored in a 'data' JSON field
        const contractData = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
        
        return {
          id: item.id,
          createdAt: item.created_at,
          userId: item.user_id,
          company: contractData.company,
          contractType: contractData.contractType,
          description: contractData.description,
          commercialTeam: contractData.commercialTeam,
          segment: contractData.segment,
          customSegment: contractData.customSegment,
          projectType: contractData.projectType,
          customProjectType: contractData.customProjectType,
          salesRepresentative: contractData.salesRepresentative,
          bdrRepresentative: contractData.bdrRepresentative,
          leadSource: contractData.leadSource,
          saleDate: contractData.saleDate,
          paymentDate: contractData.paymentDate,
          signerName: contractData.signerName,
          signerEmail: contractData.signerEmail,
          contractValue: contractData.contractValue,
          paymentMethod: contractData.paymentMethod,
          duration: contractData.duration,
          customDuration: contractData.customDuration,
          deliverables: contractData.deliverables,
          observations: contractData.observations,
          dataConfirmed: contractData.dataConfirmed
        };
      }) || [];
      
      setContracts(transformedContracts);
    } catch (error) {
      console.error("Error loading contracts:", error);
      toast.error('Erro ao carregar contratos');
    }
  };

  const addContract = async (data: Omit<Contract, "id" | "createdAt" | "userId">) => {
    if (!user) return;

    try {
      const newContract = {
        user_id: user.id,
        created_at: new Date().toISOString(),
        data: data
      };

      const { data: savedContract, error } = await supabase
        .from('contracts')
        .insert([newContract])
        .select()
        .single();

      if (error) throw error;

      // Trigger webhook
      try {
        await fetch('https://webhook.lucasfelix.com/webhook/8d8c0906-9eb9-4657-8d48-5231c1fc1feb', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            contract_id: savedContract.id,
            ...data,
            data_criacao: newContract.created_at
          }),
        });
      } catch (webhookError) {
        console.error("Error triggering webhook:", webhookError);
        // Don't throw here, as the contract was saved successfully
      }

      await loadContracts(); // Reload contracts
      toast.success('Contrato gerado com sucesso!');
    } catch (error) {
      console.error("Error saving contract:", error);
      toast.error('Erro ao gerar contrato');
    }
  };

  const getContractById = async (id: string): Promise<Contract | undefined> => {
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // If not admin, verify ownership
      if (!isAdmin && data.user_id !== user?.id) {
        throw new Error('Unauthorized');
      }

      // Transform the raw data into a Contract object
      if (data) {
        const contractData = typeof data.data === 'string' ? JSON.parse(data.data) : data.data;
        
        return {
          id: data.id,
          createdAt: data.created_at,
          userId: data.user_id,
          company: contractData.company,
          contractType: contractData.contractType,
          description: contractData.description,
          commercialTeam: contractData.commercialTeam,
          segment: contractData.segment,
          customSegment: contractData.customSegment,
          projectType: contractData.projectType,
          customProjectType: contractData.customProjectType,
          salesRepresentative: contractData.salesRepresentative,
          bdrRepresentative: contractData.bdrRepresentative,
          leadSource: contractData.leadSource,
          saleDate: contractData.saleDate,
          paymentDate: contractData.paymentDate,
          signerName: contractData.signerName,
          signerEmail: contractData.signerEmail,
          contractValue: contractData.contractValue,
          paymentMethod: contractData.paymentMethod,
          duration: contractData.duration,
          customDuration: contractData.customDuration,
          deliverables: contractData.deliverables,
          observations: contractData.observations,
          dataConfirmed: contractData.dataConfirmed
        };
      }
      
      return undefined;
    } catch (error) {
      console.error("Error fetching contract:", error);
      toast.error('Erro ao carregar contrato');
      return undefined;
    }
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
