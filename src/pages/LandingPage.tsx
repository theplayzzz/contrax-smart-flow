
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText, Check, Search } from "lucide-react";

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-brand-600">
                ContraxSmart
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Funcionalidades
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Como funciona
              </a>
            </nav>
            
            <div className="flex items-center space-x-3">
              {user ? (
                <Link to="/dashboard">
                  <Button>Meu Painel</Button>
                </Link>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                      Entrar
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button>Registrar</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-brand-600 to-brand-700 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="max-w-lg">
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6">
                  Geração inteligente de contratos empresariais
                </h1>
                <p className="text-lg sm:text-xl mb-8 text-white/90">
                  Crie contratos profissionais em minutos com preenchimento automático de dados via CNPJ. 
                  Sem complicações, sem burocracia.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/register">
                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                      Começar Gratuitamente
                    </Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-brand-600">
                      Como Funciona
                    </Button>
                  </a>
                </div>
              </div>
              
              <div className="hidden md:block">
                <div className="bg-white p-6 rounded-lg shadow-2xl transform rotate-2">
                  <div className="bg-gray-100 p-4 rounded">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="h-8 bg-brand-100 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Funcionalidades Principais
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Nossa plataforma foi criada para simplificar todo o processo de geração de contratos empresariais.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center mb-4">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Consulta CNPJ Automática</h3>
                <p className="text-gray-600">
                  Digite apenas o CNPJ e o sistema preenche automaticamente os dados da empresa, economizando seu tempo.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Geração Instantânea</h3>
                <p className="text-gray-600">
                  Gere contratos profissionais em segundos com toda a formatação legal e estruturas necessárias.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-lg flex items-center justify-center mb-4">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Histórico Completo</h3>
                <p className="text-gray-600">
                  Acesse todos os seus contratos gerados anteriormente, com busca e filtros avançados.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How it Works */}
        <section id="how-it-works" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Como Funciona
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Três passos simples para criar seu contrato profissional
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-brand-600 text-4xl font-bold mb-4">1</div>
                <h3 className="text-xl font-medium mb-2">Digite o CNPJ</h3>
                <p className="text-gray-600">
                  Entre com o CNPJ da empresa para preenchimento automático dos dados empresariais.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-brand-600 text-4xl font-bold mb-4">2</div>
                <h3 className="text-xl font-medium mb-2">Selecione o Tipo</h3>
                <p className="text-gray-600">
                  Escolha entre diferentes tipos de contrato e personalize conforme sua necessidade.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-brand-600 text-4xl font-bold mb-4">3</div>
                <h3 className="text-xl font-medium mb-2">Gere e Baixe</h3>
                <p className="text-gray-600">
                  Com um clique, gere seu contrato e baixe em PDF pronto para impressão ou envio.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/register">
                <Button size="lg">Comece Agora</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">ContraxSmart</h3>
              <p className="mb-4">
                Simplificando a geração de contratos empresariais com tecnologia inteligente.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Links Rápidos</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white">Funcionalidades</a></li>
                <li><a href="#how-it-works" className="hover:text-white">Como Funciona</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Termos de Serviço</a></li>
                <li><a href="#" className="hover:text-white">Política de Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-sm text-center">
            &copy; {new Date().getFullYear()} ContraxSmart. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
