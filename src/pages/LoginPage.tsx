
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AuthLayout from "@/components/layout/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

const LoginPage: React.FC = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <AuthLayout
      title="Entre na sua conta"
      subtitle="Bem-vindo de volta! Entre com suas credenciais para acessar o sistema."
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default LoginPage;
