
import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useContract } from "@/contexts/ContractContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { contracts } = useContract();
  const userContracts = contracts.filter((contract) => contract.user_id === user?.id);
  
  // Get the most recent contracts (up to 3)
  const recentContracts = [...userContracts]
    .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
    .slice(0, 3);

  const getUserDisplayName = () => {
    return user?.name || user?.user_metadata?.name || user?.email || 'User';
  };

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Bem-vindo, {getUserDisplayName()}!</h2>
            <p className="text-muted-foreground">
              Gerencie e crie seus contratos de forma rápida e intuitiva.
            </p>
          </div>
          
          <Link to="/contracts/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Novo Contrato
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Contratos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userContracts.length}</div>
              <p className="text-xs text-muted-foreground">
                Contratos gerados pela sua conta
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Contratos Recentes</h3>
            <Link to="/contracts" className="text-sm text-brand-600 hover:text-brand-700">
              Ver todos
            </Link>
          </div>
          
          {recentContracts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentContracts.map((contract) => (
                <Card key={contract.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {contract.dados_json.company.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      {contract.dados_json.contractType}
                    </p>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="text-xs line-clamp-2">
                      {contract.dados_json.company.cnpj} • {contract.dados_json.company.address}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link to={`/contracts/${contract.id}`} className="w-full">
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" /> Visualizar
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">
                  Você ainda não gerou nenhum contrato.
                </p>
                <Link to="/contracts/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" /> Criar Primeiro Contrato
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
