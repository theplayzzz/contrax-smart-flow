
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
import { Save, Webhook, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ContractFormData } from "@/hooks/useContractForm";

const ContractForm: React.FC = () => {
  const navigate = useNavigate();
  const { form, onSubmit } = useContractForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleSubmit = async (data: any) => {
    console.log("Form submitted with data:", data);
    setIsSubmitting(true);
    setValidationErrors([]);
    
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

  const debugFormSubmit = () => {
    const isValid = form.formState.isValid;
    const errors = form.formState.errors;
    console.log("Form is valid:", isValid);
    console.log("Form errors:", errors);
    
    const errorMessages: string[] = [];
    Object.entries(errors).forEach(([field, error]) => {
      if (error && error.message) {
        errorMessages.push(`${field}: ${error.message}`);
      }
    });
    
    setValidationErrors(errorMessages);
    
    if (!isValid) {
      toast.error("Formulário contém erros. Corrija os campos destacados.");
    }
    
    // Create a type-safe array of field names from our schema
    const formFields: Array<keyof ContractFormData> = [
      "cnpj", "name", "ownerName", "address", "phone", "businessName",
      "commercialTeam", "segment", "customSegment", "projectType", 
      "customProjectType", "salesRepresentative", "bdrRepresentative",
      "leadSource", "saleDate", "paymentDate", "signerName", "signerEmail",
      "cep", "contractValue", "paymentMethod", "duration", "customDuration",
      "deliverables", "observations", "dataConfirmed", "contractType", "description"
    ];
    
    // Filter to only get fields that have errors and are valid form fields
    const fieldKeysWithErrors = Object.keys(errors).filter(key => 
      key !== "root" && formFields.includes(key as keyof ContractFormData)
    );
    
    if (fieldKeysWithErrors.length > 0) {
      try {
        // Type assertion is safe here because we've already filtered to valid field names
        const firstErrorField = fieldKeysWithErrors[0] as keyof ContractFormData;
        console.log("Focusing on field with error:", firstErrorField);
        form.setFocus(firstErrorField);
      } catch (err) {
        console.error("Could not focus field:", err);
      }
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {validationErrors.length > 0 && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-bold mb-2">Os seguintes campos contêm erros:</div>
              <ul className="list-disc pl-4">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        
        <Form {...form}>
          <form 
            onSubmit={(e) => {
              console.log("Form submit event triggered");
              debugFormSubmit();
              form.handleSubmit(handleSubmit)(e);
            }} 
            className="space-y-8"
          >
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
                onClick={() => console.log("Button clicked")}
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
