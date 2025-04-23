
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6">
        <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-medium text-gray-700 mb-6">Página não encontrada</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link to="/">
          <Button>Voltar para a página inicial</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
