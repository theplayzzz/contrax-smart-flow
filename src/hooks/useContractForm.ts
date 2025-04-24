
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContractType } from "@/types";
import { useContract } from "@/contexts/ContractContext";
import { useNavigate } from "react-router-dom";

export const formSchema = z.object({
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

export type ContractFormData = z.infer<typeof formSchema>;

export const useContractForm = () => {
  const { addContract } = useContract();
  const navigate = useNavigate();
  
  const form = useForm<ContractFormData>({
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

  const onSubmit = (data: ContractFormData) => {
    const company = {
      cnpj: data.cnpj,
      name: data.name,
      ownerName: data.ownerName,
      address: data.address,
      phone: data.phone,
    };
    
    addContract(company, data.contractType as ContractType, data.description);
    navigate("/contracts");
  };

  return {
    form,
    onSubmit,
  };
};
