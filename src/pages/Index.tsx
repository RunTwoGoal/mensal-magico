import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, BarChart3, Calendar, Repeat, Shield, Zap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 gradient-primary rounded-full mb-6 shadow-glow">
            <DollarSign className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Mensal <span className="gradient-primary bg-clip-text text-sky-100/60">Mágico</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transforme o caos das suas contas mensais em uma experiência organizada e intuitiva. 
            Controle total das suas finanças na palma da sua mão.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="transition-smooth hover:shadow-glow">
              <Link to="/register">
                Começar Gratuitamente
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="transition-smooth">
              <Link to="/login">
                Fazer Login
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 animate-slide-up">
          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle>Controle Mensal</CardTitle>
              <CardDescription>
                Organize todas as suas contas por mês e tenha uma visão clara dos seus compromissos financeiros.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 gradient-success rounded-lg flex items-center justify-center mb-4">
                <Repeat className="h-6 w-6 text-success-foreground" />
              </div>
              <CardTitle>Contas Recorrentes</CardTitle>
              <CardDescription>
                Configure contas que se repetem todo mês automaticamente. Aluguel, internet e outras nunca mais serão esquecidas.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-warning-foreground" />
              </div>
              <CardTitle>Dashboard Inteligente</CardTitle>
              <CardDescription>
                Acompanhe o progresso dos pagamentos, valores totais e estatísticas detalhadas em tempo real.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 gradient-primary rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle>Seguro e Confiável</CardTitle>
              <CardDescription>
                Seus dados financeiros protegidos com as melhores práticas de segurança da indústria.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 gradient-accent rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle>Interface Rápida</CardTitle>
              <CardDescription>
                Designed para velocidade. Adicione, edite e gerencie suas contas em segundos, não minutos.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-smooth">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Totalmente Gratuito</CardTitle>
              <CardDescription>
                Todas as funcionalidades essenciais disponíveis gratuitamente. Sem pegadinhas, sem limitações.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in">
          <Card className="max-w-2xl mx-auto shadow-elegant">
            <CardHeader>
              <CardTitle className="text-3xl mb-4">
                Pronto para Organizar suas Finanças?
              </CardTitle>
              <CardDescription className="text-lg mb-6">
                Junte-se a milhares de pessoas que já transformaram a forma como controlam suas contas mensais.
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="transition-smooth hover:shadow-glow">
                  <Link to="/register">
                    Criar Conta Grátis
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="transition-smooth">
                  <Link to="/dashboard">
                    Ver Dashboard
                  </Link>
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 justify-center mt-4 text-sm text-muted-foreground">
                <Link to="/recurring" className="hover:text-foreground transition-colors">
                  • Contas Recorrentes
                </Link>
                <Link to="/history" className="hover:text-foreground transition-colors">
                  • Histórico Mensal
                </Link>
                <Link to="/dashboard" className="hover:text-foreground transition-colors">
                  • Dashboard Completo
                </Link>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
