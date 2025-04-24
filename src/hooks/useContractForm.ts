
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useContract } from "@/contexts/ContractContext";
import { useNavigate } from "react-router-dom";

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formSchema = z.object({
  cnpj: z
    .string()
    .min(18, "CNPJ inválido")
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "Formato de CNPJ inválido"),
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  ownerName: z.string().min(3, "Nome do proprietário deve ter pelo menos 3 caracteres"),
  address: z.string().min(5, "Endereço deve ter pelo menos 5 caracteres"),
  phone: z.string().min(8, "Telefone deve ter pelo menos 8 caracteres"),
  businessName: z.string().min(3, "Razão Social deve ter pelo menos 3 caracteres"),
  commercialTeam: z.enum(["Selva", "Cangaço"], {
    required_error: "Selecione um time comercial",
  }),
  segment: z.enum(["Serviço", "Varejo", "Indústria", "Food Service", "E-commerce", "SAAS", "Franquia", "Imobiliária", "Outro"], {
    required_error: "Selecione um segmento",
  }),
  customSegment: z.string().optional(),
  projectType: z.enum(["Recorrente", "Implementação única", "Consultoria", "Mentoria acom. mensal", "Outro"], {
    required_error: "Selecione um tipo de projeto",
  }),
  customProjectType: z.string().optional(),
  salesRepresentative: z.string().min(3, "Informe o vendedor responsável"),
  bdrRepresentative: z.string().min(3, "Informe o BDR responsável"),
  leadSource: z.enum(["Inbound", "Outbound", "Indicação"], {
    required_error: "Selecione uma origem",
  }),
  saleDate: z.date({
    required_error: "Informe a data da venda",
  }),
  paymentDate: z.date({
    required_error: "Informe a data de pagamento",
  }),
  signerName: z.string().min(3, "Informe o nome completo do assinante"),
  signerEmail: z.string().email("E-mail inválido"),
  cep: z.string().regex(/^\d{5}-\d{3}$/, "CEP inválido"),
  contractValue: z.number().positive("Valor deve ser maior que zero"),
  paymentMethod: z.enum(["Pix", "Boleto", "Cartão de crédito", "Cheque"], {
    required_error: "Selecione uma forma de pagamento",
  }),
  duration: z.enum(["12 meses", "6 meses", "3 meses", "Outro"], {
    required_error: "Selecione um prazo",
  }),
  customDuration: z.string().optional(),
  deliverables: z.string().min(10, "Descreva os entregáveis"),
  observations: z.string().optional(),
  dataConfirmed: z.boolean().refine((val) => val === true, {
    message: "Você precisa confirmar que os dados estão corretos",
  }),
  contractType: z.enum(["Consultoria", "Assessoria"], {
    required_error: "Selecione o tipo de contrato",
  }),
  description: z.string().optional(),
});

export type ContractFormData = z.infer<typeof formSchema>;

export const useContractForm = () => {
  const { addContract } = useContract();
  
  const form = useForm<ContractFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cnpj: "",
      name: "",
      ownerName: "",
      address: "",
      phone: "",
      businessName: "",
      commercialTeam: "Selva",
      segment: "Serviço",
      projectType: "Recorrente",
      salesRepresentative: "",
      bdrRepresentative: "",
      leadSource: "Inbound",
      signerName: "",
      signerEmail: "",
      cep: "",
      contractValue: 0,
      paymentMethod: "Pix",
      duration: "12 meses",
      deliverables: "",
      observations: "",
      dataConfirmed: false,
      contractType: "Consultoria",
      description: "",
    },
    mode: "onSubmit", // Changed from default to ensure validation happens on submit
  });

  const onSubmit = async (data: ContractFormData) => {
    console.log("onSubmit called with data:", data);
    
    try {
      const { cnpj, name, ownerName, address, phone, segment, customSegment, cep, businessName } = data;
      
      const company = {
        cnpj,
        name,
        ownerName,
        address, 
        phone,
        segment,
        customSegment,
        cep,
        businessName
      };
      
      console.log("Preparing to add contract with company data:", company);
      
      const result = await addContract({
        company,
        segment: data.segment,
        commercialTeam: data.commercialTeam,
        projectType: data.projectType,
        customProjectType: data.customProjectType,
        salesRepresentative: data.salesRepresentative,
        bdrRepresentative: data.bdrRepresentative,
        leadSource: data.leadSource,
        saleDate: data.saleDate.toISOString(),
        paymentDate: data.paymentDate.toISOString(),
        signerName: data.signerName,
        signerEmail: data.signerEmail,
        contractValue: data.contractValue,
        paymentMethod: data.paymentMethod,
        duration: data.duration,
        customDuration: data.customDuration,
        deliverables: data.deliverables,
        observations: data.observations,
        dataConfirmed: data.dataConfirmed,
        contractType: data.contractType,
        description: data.description
      });
      
      console.log("Contract added successfully, result:", result);
      return true;
    } catch (error) {
      console.error("Error in onSubmit:", error);
      throw error; // Re-throw the error to be caught by the form's error handler
    }
  };

  return {
    form,
    onSubmit,
  };
};
