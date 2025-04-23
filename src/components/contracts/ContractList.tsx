
import React from "react";
import { Contract } from "@/types";
import ContractCard from "./ContractCard";

interface ContractListProps {
  contracts: Contract[];
}

const ContractList: React.FC<ContractListProps> = ({ contracts }) => {
  if (contracts.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Nenhum contrato encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contracts.map((contract) => (
        <ContractCard key={contract.id} contract={contract} />
      ))}
    </div>
  );
};

export default ContractList;
