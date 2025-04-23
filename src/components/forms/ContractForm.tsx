
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContract } from "@/contexts/ContractContext";
import { Company, ContractType } from "@/types";
import { fetchCompanyData } from "@/services/cnpjaService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import CNPJField from "./CNPJField";

const formSchema = z.object({
  cnpj: z
    .string()
    .min(18, "CNPJ inválido")
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "Formato de CNPJ inválido"),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  ownerName: z.string().min(3, "Nome do proprietário deve ter pelo menos 3 caracteres"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  phone: z.string().min(8, "Telefone deve ter pelo menos 8 caracteres"),
  contractType: z.enum(["Consultoria", "Assessoria"]),
  description: z.string().optional(),
});

const ContractForm: React.FC = () => {
  const { addContract } = useContract();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cnpj: "",
      name: "",
      ownerName: "",
      address: "",
      phone: "",
      contractType: "Consultoria",
      description: "",
    },
  });

  const handleCNPJSearch = async () => {
    const cnpj = form.getValues("cnpj");
    
    if (cnpj.replace(/\D/g, "").length !== 14) {
      form.setError("cnpj", {
        type: "manual",
        message: "CNPJ inválido",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const companyData = await fetchCompanyData(cnpj);
      
      if (companyData) {
        form.setValue("name", companyData.name);
        form.setValue("ownerName", companyData.ownerName);
        form.setValue("address", companyData.address);
        form.setValue("phone", companyData.phone);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const company: Company = {
      cnpj: data.cnpj,
      name: data.name,
      ownerName: data.ownerName,
      address: data.address,
      phone: data.phone,
    };
    
    addContract(company, data.contractType as ContractType, data.description);
    navigate("/contracts");
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
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
                control={form.control}
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
                control={form.control}
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
              control={form.control}
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
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
              
              <FormField
                control={form.control}
                name="contractType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de contrato</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Consultoria">Consultoria</SelectItem>
                        <SelectItem value="Assessoria">Assessoria</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descreva o objetivo do contrato..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard")}
              >
                Cancelar
              </Button>
              <Button type="submit">Gerar Contrato</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContractForm;
