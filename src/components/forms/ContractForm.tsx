
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
import { Save, Webhook } from "lucide-react";
import { toast } from "sonner";

const ContractForm: React.FC = () => {
  const navigate = useNavigate();
  const { form, onSubmit } = useContractForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    
    try {
      console.log("Attempting to submit form...");
      await onSubmit(data);
      console.log("Form submitted successfully!");
      toast.success("Contrato gerado com sucesso!");
      navigate("/contracts");
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      toast.error("Erro ao gerar contrato. Por favor, tente novamente.");
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
                    <Webhook className="animate-spin h-4 w-4" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
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
