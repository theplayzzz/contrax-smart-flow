
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@/types";
import { toast } from 'sonner';
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para gerar UUID v4 válido
const generateUUID = () => {
  return crypto.randomUUID();
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Garantir que o usuário tenha um ID no formato UUID
        if (!parsedUser.id || typeof parsedUser.id !== 'string' || !parsedUser.id.includes('-')) {
          console.log("Convertendo ID do usuário para UUID válido");
          parsedUser.id = generateUUID();
          localStorage.setItem("user", JSON.stringify(parsedUser));
        }
        
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Função para criar ou atualizar o perfil do usuário no Supabase
  const saveUserProfile = async (userId: string, name: string) => {
    try {
      console.log("Salvando perfil de usuário no Supabase:", { userId, name });
      
      // Verificar se o perfil já existe
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .maybeSingle();
      
      if (fetchError) {
        console.error("Erro ao verificar perfil existente:", fetchError);
        return;
      }
      
      if (existingProfile) {
        console.log("Perfil já existe, atualizando...");
        const { error } = await supabase
          .from('profiles')
          .update({ role: 'user' })
          .eq('id', userId);
          
        if (error) {
          console.error("Erro ao atualizar perfil:", error);
        } else {
          console.log("Perfil atualizado com sucesso!");
        }
      } else {
        console.log("Criando novo perfil...");
        const { error } = await supabase
          .from('profiles')
          .insert([{ id: userId, role: 'user' }]);
          
        if (error) {
          console.error("Erro ao criar perfil:", error);
        } else {
          console.log("Perfil criado com sucesso!");
        }
      }
    } catch (error) {
      console.error("Erro ao salvar perfil:", error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Iniciando autenticação real com Supabase para:", email);

      // Usar autenticação real do Supabase em vez de simulação
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error("Erro de autenticação Supabase:", error);
        toast.error(error.message || 'Credenciais inválidas');
        return;
      }

      if (data.user) {
        console.log("Login bem-sucedido:", data.user);
        // Criar objeto de usuário a partir da resposta do Supabase
        const user: User = {
          id: data.user.id,
          email: data.user.email || "",
          user_metadata: { 
            name: data.user.user_metadata?.name || email.split('@')[0] 
          }
        };
        
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Salvar perfil no Supabase
        await saveUserProfile(
          data.user.id, 
          data.user.user_metadata?.name || email.split('@')[0]
        );
        
        const redirectPath = location.state?.from?.pathname || "/dashboard";
        navigate(redirectPath);
        toast.success('Login realizado com sucesso!');
      }
    } catch (error) {
      console.error("Erro não tratado durante login:", error);
      toast.error('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      console.log("Registrando novo usuário com Supabase:", email, name);
      
      // Usar registro real do Supabase em vez de simulação
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error("Erro de registro Supabase:", error);
        toast.error(error.message || 'Erro ao registrar');
        return;
      }

      if (data.user) {
        console.log("Registro bem-sucedido:", data.user);
        // Criar objeto de usuário a partir da resposta do Supabase
        const user: User = {
          id: data.user.id,
          email: data.user.email || "",
          user_metadata: { name }
        };
        
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));
        
        // Salvar perfil no Supabase
        await saveUserProfile(data.user.id, name);
        
        navigate("/dashboard");
        toast.success('Registro realizado com sucesso!');
      }
    } catch (error) {
      console.error("Erro não tratado durante registro:", error);
      toast.error('Erro ao registrar');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Usar logout real do Supabase em vez de simulação
      await supabase.auth.signOut();
      setUser(null);
      localStorage.removeItem("user");
      navigate("/");
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
