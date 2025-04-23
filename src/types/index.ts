
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Company {
  cnpj: string;
  name: string;
  ownerName: string;
  address: string;
  phone: string;
}

export type ContractType = "Consultoria" | "Assessoria";

export interface Contract {
  id: string;
  company: Company;
  contractType: ContractType;
  description?: string;
  createdAt: string;
  userId: string;
}

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
