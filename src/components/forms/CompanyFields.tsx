
import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import CNPJField from "./CNPJField";
import { fetchCompanyData } from "@/services/cnpjaService";
import { toast } from "sonner";

export const CompanyFields = () => {
  const { control, setValue } = useFormContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleCNPJSearch = async () => {
    const cnpj = control._formValues.cnpj;
    
    if (cnpj.replace(/\D/g, "").length !== 14) {
      toast.error("CNPJ inválido. Digite um CNPJ completo.");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const companyData = await fetchCompanyData(cnpj);
      
      if (companyData) {
        setValue("name", companyData.name);
        setValue("ownerName", companyData.ownerName);
        setValue("address", companyData.address);
        setValue("phone", companyData.phone);
        toast.success("Dados da empresa carregados com sucesso!");
      }
    } catch (error) {
      console.error("Error in handleCNPJSearch:", error);
      toast.error("Erro ao processar dados da empresa");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FormField
        control={control}
        name="cnpj"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CNPJ da empresa</FormLabel>
            <FormControl>
              <CNPJField
                value={field.value}
                onChange={field.onChange}
                onSearch={handleCNPJSearch}
                isLoading={isLoading}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da empresa</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="ownerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do proprietário</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Endereço completo</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Telefone</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
