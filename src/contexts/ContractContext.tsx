
import React, { createContext, useContext, useState } from "react";
import { Contract, Company, ContractType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from 'sonner';

interface ContractContextType {
  contracts: Contract[];
  addContract: (company: Company, contractType: ContractType, description?: string) => void;
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

  const addContract = (company: Company, contractType: ContractType, description?: string) => {
    if (!user) return;

    const newContract: Contract = {
      id: Date.now().toString(),
      company,
      contractType,
      description,
      createdAt: new Date().toISOString(),
      userId: user.id,
    };

    const updatedContracts = [...contracts, newContract];
    setContracts(updatedContracts);
    localStorage.setItem("contracts", JSON.stringify(updatedContracts));
    toast.success('Contrato gerado com sucesso!');
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
