
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthLayout from "@/components/layout/AuthLayout";
import RegisterForm from "@/components/auth/RegisterForm";

const RegisterPage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout
      title="Crie sua conta"
      subtitle="Preencha os dados abaixo para se registrar no sistema. Seus dados serão salvos automaticamente no banco de dados."
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default RegisterPage;
