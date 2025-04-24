
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    name?: string;
  };
}

export interface Profile {
  id: string;
  role: 'admin' | 'user';
  created_at: string;
}

export interface Company {
  cnpj: string;
  name: string;
  ownerName: string;
  address: string;
  phone: string;
  segment?: string;
  customSegment?: string;
  cep?: string;
  businessName?: string;
}

export type CommercialTeam = "Selva" | "Cangaço";
export type ProjectType = "Recorrente" | "Implementação única" | "Consultoria" | "Mentoria acom. mensal" | "Outro";
export type BusinessSegment = "Serviço" | "Varejo" | "Indústria" | "Food Service" | "E-commerce" | "SAAS" | "Franquia" | "Imobiliária" | "Outro";
export type LeadSource = "Inbound" | "Outbound" | "Indicação";
export type PaymentMethod = "Pix" | "Boleto" | "Cartão de crédito" | "Cheque";
export type ContractDuration = "12 meses" | "6 meses" | "3 meses" | "Outro";

export interface Contract {
  id: string;
  user_id: string;
  dados_json: {
    company: Company;
    contractType: ContractType;
    description?: string;
    commercialTeam: CommercialTeam;
    segment: BusinessSegment;
    customSegment?: string;
    projectType: ProjectType;
    customProjectType?: string;
    salesRepresentative: string;
    bdrRepresentative: string;
    leadSource: LeadSource;
    saleDate: string;
    paymentDate: string;
    signerName: string;
    signerEmail: string;
    contractValue: number;
    paymentMethod: PaymentMethod;
    duration: ContractDuration;
    customDuration?: string;
    deliverables: string;
    observations?: string;
    dataConfirmed: boolean;
  };
  data_criacao: string;
  updated_at: string;
}

export type ContractType = "Consultoria" | "Assessoria";

export interface CNPJAResponse {
  cnpj: {
    numero: string;
  };
  razao_social: string;
  estabelecimento: {
    tipo_logradouro: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cep: string;
    ddd1: string;
    telefone1: string;
    municipio: string;
    uf: string;
  };
  socios: Array<{
    nome: string;
    tipo: string;
  }>;
}

