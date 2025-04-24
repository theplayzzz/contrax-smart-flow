
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContract } from "@/contexts/ContractContext";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ContractDetail from "@/components/contracts/ContractDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Contract } from "@/types";

const ContractDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getContractById } = useContract();
  const navigate = useNavigate();
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchContract = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const fetchedContract = await getContractById(id);
        
        if (fetchedContract) {
          setContract(fetchedContract as Contract);
        } else {
          setError("Contrato não encontrado");
        }
      } catch (err) {
        setError("Erro ao carregar contrato");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContract();
  }, [id, getContractById]);
  
  if (isLoading) {
    return (
      <DashboardLayout title="Carregando...">
        <div className="text-center py-10">
          <p className="text-gray-500">Carregando contrato...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !contract) {
    return (
      <DashboardLayout title="Contrato não encontrado">
        <div className="text-center py-10">
          <h2 className="text-xl font-bold mb-4">Contrato não encontrado</h2>
          <p className="text-gray-500 mb-6">
            O contrato solicitado não foi encontrado ou você não tem acesso a ele.
          </p>
          <Button onClick={() => navigate("/contracts")}>
            Voltar para Contratos
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout title="Detalhes do Contrato">
      <div className="space-y-6">
        <div className="flex items-center">
          <Button
            variant="link"
            className="pl-0"
            onClick={() => navigate("/contracts")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Voltar para Contratos
          </Button>
        </div>
        
        <ContractDetail contract={contract} />
      </div>
    </DashboardLayout>
  );
};

export default ContractDetailPage;
