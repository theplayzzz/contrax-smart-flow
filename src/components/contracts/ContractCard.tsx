
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Contract } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface ContractCardProps {
  contract: Contract;
}

const ContractCard: React.FC<ContractCardProps> = ({ contract }) => {
  const formattedDate = format(new Date(contract.createdAt), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-medium truncate">{contract.company.name}</h3>
            <p className="text-sm text-muted-foreground">{contract.company.cnpj}</p>
          </div>
          <div className="px-2 py-1 text-xs rounded-full bg-brand-100 text-brand-600 font-medium">
            {contract.contractType}
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Proprietário:</span> {contract.company.ownerName}</p>
          <p className="line-clamp-1"><span className="font-medium">Endereço:</span> {contract.company.address}</p>
          <p><span className="font-medium">Telefone:</span> {contract.company.phone}</p>
          {contract.description && (
            <p className="line-clamp-2 text-muted-foreground mt-2">{contract.description}</p>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-stretch space-y-3 pb-4">
        <p className="text-xs text-muted-foreground">Criado em {formattedDate}</p>
        <Link to={`/contracts/${contract.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            <FileText className="h-4 w-4 mr-2" /> Visualizar Contrato
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ContractCard;
