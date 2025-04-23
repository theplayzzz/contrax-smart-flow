
import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Contract } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Download, Printer } from "lucide-react";

interface ContractDetailProps {
  contract: Contract;
}

const ContractDetail: React.FC<ContractDetailProps> = ({ contract }) => {
  const formattedDate = format(new Date(contract.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Contrato de {contract.contractType}</h2>
            <div className="text-muted-foreground text-sm">{formattedDate}</div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 pb-8">
          <div className="space-y-6 text-sm leading-relaxed">
            <div className="text-center mb-8">
              <h1 className="text-lg font-bold uppercase">
                CONTRATO DE {contract.contractType.toUpperCase()}
              </h1>
              <p className="text-muted-foreground mt-1">
                Ref: {contract.id}
              </p>
            </div>
            
            <p className="font-semibold">PARTES CONTRATANTES:</p>
            
            <p>
              <span className="font-semibold">CONTRATADA:</span> {contract.company.name}, inscrita no CNPJ sob o nº {contract.company.cnpj}, 
              com sede em {contract.company.address}, neste ato representada por {contract.company.ownerName}, 
              doravante denominada simplesmente CONTRATADA.
            </p>
            
            <p>
              <span className="font-semibold">CONTRATANTE:</span> [Nome da Contratante], inscrita no CNPJ sob o nº [CNPJ], 
              com sede em [Endereço], neste ato representada pelo seu representante legal, 
              doravante denominada simplesmente CONTRATANTE.
            </p>
            
            <p className="font-semibold">OBJETO DO CONTRATO:</p>
            
            <p>
              O presente contrato tem por objeto a prestação de serviços de {contract.contractType.toLowerCase()} 
              pela CONTRATADA à CONTRATANTE, conforme as especificações descritas neste instrumento.
              {contract.description && (
                <>
                  <br /><br />
                  <span className="font-semibold">Descrição específica:</span> {contract.description}
                </>
              )}
            </p>
            
            <p className="font-semibold">CLÁUSULAS E CONDIÇÕES:</p>
            
            <p>
              <span className="font-semibold">1. SERVIÇOS A SEREM PRESTADOS</span><br />
              A CONTRATADA compromete-se a prestar serviços de {contract.contractType.toLowerCase()} nas áreas específicas acordadas 
              entre as partes, incluindo, mas não se limitando a: análises, recomendações, relatórios e acompanhamento de atividades.
            </p>
            
            <p>
              <span className="font-semibold">2. PRAZO</span><br />
              O presente contrato terá vigência de 12 (doze) meses, iniciando-se na data de sua assinatura, 
              podendo ser prorrogado mediante acordo entre as partes.
            </p>
            
            <p>
              <span className="font-semibold">3. VALOR E FORMA DE PAGAMENTO</span><br />
              Pelo serviço objeto deste contrato, a CONTRATANTE pagará à CONTRATADA o valor mensal de R$ XX.XXX,XX 
              (valor por extenso), com vencimento todo dia 10 de cada mês subsequente ao da prestação dos serviços.
            </p>
            
            <p>
              <span className="font-semibold">4. OBRIGAÇÕES DA CONTRATADA</span><br />
              A CONTRATADA se obriga a executar os serviços com zelo e eficiência, observando os padrões de qualidade esperados 
              para o tipo de serviço contratado.
            </p>
            
            <p>
              <span className="font-semibold">5. OBRIGAÇÕES DA CONTRATANTE</span><br />
              A CONTRATANTE se obriga a fornecer à CONTRATADA todas as informações e documentos necessários à execução dos serviços, 
              bem como efetuar os pagamentos nas datas avençadas.
            </p>
            
            <p>
              <span className="font-semibold">6. RESCISÃO</span><br />
              O presente contrato poderá ser rescindido por qualquer das partes mediante notificação prévia de 30 (trinta) dias, 
              ou imediatamente em caso de descumprimento de qualquer cláusula contratual.
            </p>
            
            <p className="font-semibold mt-8">E por estarem assim justas e contratadas, as partes firmam o presente instrumento em 2 (duas) vias de igual teor.</p>
            
            <div className="pt-8 space-y-8">
              <div>
                <p className="text-center">[Local], [Data]</p>
              </div>
              
              <div className="flex flex-col md:flex-row md:justify-between space-y-6 md:space-y-0">
                <div className="text-center">
                  <div className="border-t border-black w-48 mx-auto pt-2">
                    <p>CONTRATADA</p>
                    <p>{contract.company.name}</p>
                    <p>{contract.company.cnpj}</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="border-t border-black w-48 mx-auto pt-2">
                    <p>CONTRATANTE</p>
                    <p>[Nome da Contratante]</p>
                    <p>[CNPJ da Contratante]</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="bg-gray-50 border-t flex flex-wrap gap-3 justify-end">
          <Button variant="outline">
            <Printer className="h-4 w-4 mr-2" /> Imprimir
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" /> Baixar PDF
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ContractDetail;
