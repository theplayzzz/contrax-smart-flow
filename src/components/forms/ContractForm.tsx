
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CompanyFields } from "./CompanyFields";
import { ContractFields } from "./ContractFields";
import { ContractDetailsFields } from "./ContractDetailsFields";
import { useContractForm } from "@/hooks/useContractForm";
import { Separator } from "@/components/ui/separator";
import { save, webhook } from "lucide-react";

const ContractForm: React.FC = () => {
  const navigate = useNavigate();
  const { form, onSubmit } = useContractForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Dados da empresa</h3>
                <p className="text-sm text-muted-foreground">
                  Preencha os dados da empresa contratante
                </p>
              </div>
              <CompanyFields />
            </div>
            
            <Separator />
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Detalhes do contrato</h3>
                <p className="text-sm text-muted-foreground">
                  Informe os detalhes específicos do contrato
                </p>
              </div>
              <ContractDetailsFields />
            </div>
            
            <Separator />
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Tipo de contrato</h3>
                <p className="text-sm text-muted-foreground">
                  Selecione o tipo e adicione uma descrição opcional
                </p>
              </div>
              <ContractFields />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/contracts")}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? (
                  <>
                    <webhook className="animate-spin h-4 w-4" />
                    Processando...
                  </>
                ) : (
                  <>
                    <save className="h-4 w-4" />
                    Gerar Contrato
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContractForm;
