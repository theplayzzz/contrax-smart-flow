
import React from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Left side - Branding & Info */}
      <div className="hidden sm:flex sm:w-1/2 bg-brand-600 text-white p-8 flex-col justify-between">
        <div className="mb-auto">
          <Link to="/" className="text-4xl font-bold mb-6 block">ContraxSmart</Link>
          <p className="text-lg opacity-80 mb-4">Sistema inteligente para geração de contratos</p>
        </div>
        
        <div className="mt-auto">
          <p className="text-sm opacity-70">
            &copy; {new Date().getFullYear()} ContraxSmart. Todos os direitos reservados.
          </p>
        </div>
      </div>
      
      {/* Right side - Auth Form */}
      <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center">
        <div className="sm:hidden text-2xl font-bold mb-8 text-brand-600">ContraxSmart</div>
        
        <div className="max-w-md mx-auto w-full">
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          <p className="text-gray-500 mb-6">{subtitle}</p>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
