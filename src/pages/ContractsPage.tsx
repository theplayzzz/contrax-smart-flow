
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useContract } from "@/contexts/ContractContext";
import { ContractType } from "@/types";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ContractList from "@/components/contracts/ContractList";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContractsPage: React.FC = () => {
  const { user } = useAuth();
  const { contracts } = useContract();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string | null>(null);

  // Filter contracts by user
  const userContracts = contracts.filter((contract) => contract.user_id === user?.id);

  // Apply search and filters
  const filteredContracts = userContracts.filter((contract) => {
    const matchesSearch =
      searchTerm === "" ||
      contract.dados_json.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.dados_json.company.cnpj.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      !filterType ||
      filterType === "all" ||
      contract.dados_json.contractType === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <DashboardLayout title="Contratos">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Seus Contratos</h2>
            <p className="text-muted-foreground">
              Gerencie todos os seus contratos em um só lugar.
            </p>
          </div>
          
          <Link to="/contracts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Novo Contrato
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar por nome ou CNPJ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select
            value={filterType || "all"}
            onValueChange={(value) => setFilterType(value === "all" ? null : value)}
          >
            <SelectTrigger className="w-auto min-w-[180px]">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              <SelectItem value="Consultoria">Consultoria</SelectItem>
              <SelectItem value="Assessoria">Assessoria</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ContractList contracts={filteredContracts} />
      </div>
    </DashboardLayout>
  );
};

export default ContractsPage;
