
import React, { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface CNPJFieldProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const CNPJField: React.FC<CNPJFieldProps> = ({
  value,
  onChange,
  onSearch,
  isLoading,
}) => {
  const formatCNPJ = (cnpj: string): string => {
    cnpj = cnpj.replace(/\D/g, "");
    
    if (cnpj.length > 14) {
      cnpj = cnpj.substring(0, 14);
    }
    
    if (cnpj.length > 12) {
      cnpj = `${cnpj.substring(0, 2)}.${cnpj.substring(2, 5)}.${cnpj.substring(5, 8)}/${cnpj.substring(8, 12)}-${cnpj.substring(12)}`;
    } else if (cnpj.length > 8) {
      cnpj = `${cnpj.substring(0, 2)}.${cnpj.substring(2, 5)}.${cnpj.substring(5, 8)}/${cnpj.substring(8)}`;
    } else if (cnpj.length > 5) {
      cnpj = `${cnpj.substring(0, 2)}.${cnpj.substring(2, 5)}.${cnpj.substring(5)}`;
    } else if (cnpj.length > 2) {
      cnpj = `${cnpj.substring(0, 2)}.${cnpj.substring(2)}`;
    }
    
    return cnpj;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedCnpj = formatCNPJ(e.target.value);
    onChange(formattedCnpj);
  };

  return (
    <div className="flex space-x-2">
      <div className="flex-grow">
        <Input
          placeholder="00.000.000/0001-00"
          value={value}
          onChange={handleChange}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Para testar, use: 12.345.678/0001-99 ou 98.765.432/0001-88
        </p>
      </div>
      <Button
        type="button"
        onClick={onSearch}
        disabled={isLoading || value.replace(/\D/g, "").length < 14}
        className="min-w-[120px]"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Buscando
          </span>
        ) : (
          <span className="flex items-center">
            <Search className="h-4 w-4 mr-1" /> Buscar
          </span>
        )}
      </Button>
    </div>
  );
};

export default CNPJField;
