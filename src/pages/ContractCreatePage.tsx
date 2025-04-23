
import React from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ContractForm from "@/components/forms/ContractForm";

const ContractCreatePage: React.FC = () => {
  return (
    <DashboardLayout title="Novo Contrato">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gerar Novo Contrato</h2>
          <p className="text-muted-foreground">
            Preencha os dados da empresa para gerar um contrato automaticamente.
          </p>
        </div>
        
        <ContractForm />
      </div>
    </DashboardLayout>
  );
};

export default ContractCreatePage;
