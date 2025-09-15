import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Repeat,
  Calendar,
  DollarSign,
  Infinity
} from "lucide-react";
import { AddAccountDialog } from "@/components/AddAccountDialog";
import { EditRecurringAccountDialog } from "@/components/EditRecurringAccountDialog";
import AppHeader from "@/components/AppHeader";
import api from "@/api";



// Mock data - substitua pela chamada à sua API
const mockRecurringAccounts = [
  {
    id: 1,
    name: "Aluguel",
    amount: 1200.00,
    day: 5,
    category: "Moradia",
    repeatType: "forever",
    repeatCount: null,
    remainingOccurrences: null,
    createdDate: "2024-01-01"
  },
  {
    id: 2,
    name: "Energia Elétrica",
    amount: 180.50,
    day: 15,
    category: "Utilities",
    repeatType: "limited",
    repeatCount: 12,
    remainingOccurrences: 8,
    createdDate: "2024-01-01"
  },
  {
    id: 3,
    name: "Curso Online",
    amount: 89.90,
    day: 10,
    category: "Educação",
    repeatType: "limited",
    repeatCount: 3,
    remainingOccurrences: 1,
    createdDate: "2024-01-01"
  }
];
type RecurringApi = {
  id: string | number;
  name: string;
  amount: number;
  day?: number | null;
  category?: string;
  repeatType?: string;               // ex.: "forever" | "limited"
  repeatCount?: number | null;
  remainingOccurrences?: number | null;
  createdDate?: string | null;       // às vezes a API pode mandar este...
  created_at?: string | null;        // ...ou este (como no Mongo)
};

// Seu UI type continua exigindo `day: number`
type UiRecurring = {
  id: string | number;
  name: string;
  amount: number;
  day: number;                       // sempre número
  category: string;
  repeatType?: string;
  repeatCount?: number;
  remainingOccurrences?: number;
  createdDate?: string;              // string (ISO) para exibir
};

// Helper para pegar o dia com fallback seguro (1–28 para evitar meses curtos, se preferir)
const coerceDay = (day?: number | null): number => {
  if (typeof day === "number" && !Number.isNaN(day) && day >= 1 && day <= 31) return day;
  // fallback: usa o dia de hoje, ou 1
  const today = new Date().getDate();
  return Math.min(Math.max(today, 1), 31);
};

// Converte RecurringApi -> UiRecurring (com defaults)
const toUi = (item: RecurringApi): UiRecurring => {
  const created =
    item.created_at ??
    item.createdDate ??
    null;

  return {
    id: item.id,
    name: item.name,
    amount: Number(item.amount ?? 0),
    day: coerceDay(item.day),                         // <-- garante number
    category: item.category ?? "Outros",
    repeatType: item.repeatType ?? "forever",
    repeatCount: item.repeatCount ?? undefined,
    remainingOccurrences: item.remainingOccurrences ?? undefined,
    createdDate: created ? String(created) : undefined,
  };
};

const fmt = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",    // 10/09/2025
  timeStyle: "short",    // 21:24
  timeZone: "America/Sao_Paulo", // Fuso fixo
});

export function formatIsoToLocal(iso?: string) {
  if (!iso) return "";
  return fmt.format(new Date(iso));
}
const RecurringAccounts = () => {
  const [accounts, setAccounts] = useState<UiRecurring[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);

  useEffect(() => {
  const fetchRecurring = async () => {
    try {
      const { data } = await api.get<RecurringApi[] | { recurringAccounts: RecurringApi[] }>("/recurring/");
      console.log(data);
      const list: RecurringApi[] = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.recurringAccounts)
        ? (data as any).recurringAccounts
        : [];

      const ui = list.map(toUi);
      
      setAccounts(ui);
    } catch (e: any) {
      console.error("Erro ao carregar contas recorrentes:", e);
    }
  };
  fetchRecurring();
}, []);


  const handleAddAccount = async (newAccount: any) => {

    const account = {
      id: Date.now(),
      ...newAccount,
      createdDate: new Date().toISOString().split('T')[0]
    };

    try{
      console.log("Adicionando conta recorrente:", newAccount);
      const {data} = await api.post<RecurringApi>("/recurring/insert", { ...newAccount } );
      console.log("Conta recorrente adicionada com sucesso:", data);
    }
    catch(error){
      console.error("Erro ao adicionar conta recorrente:", error);
    }
    setAccounts([...accounts, account]);
    setIsAddDialogOpen(false);
  };


  const handleEditAccount = (updatedAccount: any) => {
    setAccounts(accounts.map(account => 
      account.id === editingAccount.id 
        ? { ...account, ...updatedAccount }
        : account
    ));
    setEditingAccount(null);
  };

  const handleDeleteAccount = (accountId: string | number) => {
    if (confirm("Tem certeza que deseja excluir esta conta recorrente?")) {
      setAccounts(accounts.filter(account => account.id !== accountId));
    }
  };

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
    <div className="min-h-screen gradient-bg">
      <AppHeader />
      <div className="p-4">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contas Recorrentes</h1>
            <p className="text-muted-foreground">Gerencie suas contas que se repetem mensalmente</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/dashboard'}
              className="transition-smooth"
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Ver Dashboard
            </Button>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="transition-smooth hover:shadow-glow"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Conta Recorrente
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recorrentes</CardTitle>
              <Repeat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{accounts.length}</div>
              <p className="text-xs text-muted-foreground">contas cadastradas</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Mensal</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {accounts.reduce((sum, account) => sum + account.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">valor total mensal</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Finalizando</CardTitle>
              <Calendar className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {accounts.filter(acc => acc.repeatType === 'limited' && acc.remainingOccurrences && acc.remainingOccurrences <= 3).length}
              </div>
              <p className="text-xs text-muted-foreground">contas próximas do fim</p>
            </CardContent>
          </Card>
        </div>

        {/* Recurring Accounts List */}
        <Card className="shadow-card animate-slide-up">
          <CardHeader>
            <CardTitle>Suas Contas Recorrentes</CardTitle>
            <CardDescription>
              Visualize e edite suas contas que se repetem automaticamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {accounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma conta recorrente cadastrada
                </div>
              ) : (
                accounts.map((account) => (
                  <Card key={account.id} className="transition-smooth hover:shadow-card">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <h3 className="font-semibold text-lg">{account.name}</h3>
                            <Badge className={getCategoryColor(account.category)}>
                              {account.category}
                            </Badge>
                            {account.repeatType === 'forever' ? (
                              <Badge variant="outline" className="text-accent">
                                <Infinity className="w-3 h-3 mr-1" />
                                Para sempre
                              </Badge>
                            ) : (
                              <Badge variant="outline" className={account.remainingOccurrences && account.remainingOccurrences <= 3 ? 'text-warning' : ''}>
                                <Repeat className="w-3 h-3 mr-1" />
                                {account.remainingOccurrences} restantes
                              </Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-medium text-foreground">
                                R$ {account.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Todo dia {account.day} do mês
                              </span>
                            </div>
                            {account.repeatType === 'limited' && (
                              <div className="text-xs">
                                Total: {account.repeatCount} vezes | Criada em {account.createdDate 
  ? new Date(account.createdDate).toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }) 
  : '—'}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingAccount(account)}
                            className="transition-smooth hover:shadow-glow"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAccount(account.id)}
                            className="text-destructive hover:text-destructive-foreground hover:bg-destructive transition-smooth"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Add Account Dialog */}
        <AddAccountDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={handleAddAccount}
          isRecurringMode={true}
        />

        {/* Edit Account Dialog */}
        {editingAccount && (
          <EditRecurringAccountDialog
            open={!!editingAccount}
            onOpenChange={() => setEditingAccount(null)}
            onSave={handleEditAccount}
            account={editingAccount}
          />
        )}
        </div>
      </div>
    </div>
  );
};

export default RecurringAccounts;