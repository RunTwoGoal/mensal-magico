import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  Trash2, 
  Calendar,
  Repeat,
  DollarSign 
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface AccountCardProps {
  account: {
    id: number;
    name: string;
    amount: number;
    dueDate: string;
    category: string;
    isRecurring: boolean;
    isPaid: boolean;
    status: string;
  };
  onTogglePaid: (id: number) => void;
  onDelete: (id: number) => void;
  readOnly?: boolean;
}

export function AccountCard({ account, onTogglePaid, onDelete, readOnly = false }: AccountCardProps) {
  const dueDate = new Date(account.dueDate);
  const isOverdue = !account.isPaid && dueDate < new Date();

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Moradia': 'bg-blue-100 text-blue-800',
      'Utilities': 'bg-yellow-100 text-yellow-800',
      'Alimentação': 'bg-green-100 text-green-800',
      'Transporte': 'bg-purple-100 text-purple-800',
      'Saúde': 'bg-red-100 text-red-800',
      'Educação': 'bg-indigo-100 text-indigo-800',
      'Lazer': 'bg-pink-100 text-pink-800',
      'Outros': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['Outros'];
  };

  return (
    <Card className={`transition-smooth hover:shadow-card ${
      account.isPaid ? 'bg-success/5 border-success/20' : 
      isOverdue ? 'bg-destructive/5 border-destructive/20' : 
      'bg-card'
    }`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header com nome e badges */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-lg flex-1 min-w-0">{account.name}</h3>
            {account.isRecurring && (
              <Badge variant="outline" className="text-xs whitespace-nowrap">
                <Repeat className="w-3 h-3 mr-1" />
                Recorrente
              </Badge>
            )}
            <Badge className={`${getCategoryColor(account.category)} whitespace-nowrap`}>
              {account.category}
            </Badge>
          </div>
          
          {/* Informações financeiras */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span className="font-medium text-foreground">
                R$ {account.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                {format(dueDate, "dd 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
          </div>

          {/* Botões de ação */}
          {!readOnly && (
            <div className="flex items-center gap-2 pt-2">
              <Button
                variant={account.isPaid ? "default" : "outline"}
                size="sm"
                onClick={() => onTogglePaid(account.id)}
                className={`transition-smooth flex-1 sm:flex-initial ${
                  account.isPaid 
                    ? 'bg-success hover:bg-success/90 text-success-foreground' 
                    : 'hover:shadow-glow'
                }`}
              >
                {account.isPaid ? (
                  <>
                    <CheckCircle className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Pago</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4 sm:mr-2" />
                    <span className="hidden sm:inline">Marcar como Pago</span>
                    <span className="sm:hidden">Pagar</span>
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(account.id)}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive transition-smooth"
              >
                <Trash2 className="w-4 h-4" />
                <span className="sr-only">Excluir</span>
              </Button>
            </div>
          )}
        </div>

        {isOverdue && !account.isPaid && (
          <div className="mt-3 p-2 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive font-medium">
              ⚠️ Esta conta está em atraso
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}