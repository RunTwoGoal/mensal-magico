import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddAccountDialog } from "@/components/AddAccountDialog";
import { AccountCard } from "@/components/AccountCard";

// Mock data - substitua pela chamada à sua API
const mockAccounts = [
  {
    id: 1,
    name: "Aluguel",
    amount: 1200.00,
    dueDate: "2024-01-05",
    category: "Moradia",
    isRecurring: true,
    isPaid: true,
    status: "paid"
  },
  {
    id: 2,
    name: "Energia Elétrica",
    amount: 180.50,
    dueDate: "2024-01-15",
    category: "Utilities",
    isRecurring: true,
    isPaid: false,
    status: "pending"
  },
  {
    id: 3,
    name: "Supermercado",
    amount: 450.00,
    dueDate: "2024-01-20",
    category: "Alimentação",
    isRecurring: false,
    isPaid: false,
    status: "pending"
  },
  {
    id: 4,
    name: "Internet",
    amount: 89.90,
    dueDate: "2024-01-10",
    category: "Utilities",
    isRecurring: true,
    isPaid: true,
    status: "paid"
  }
];

const Dashboard = () => {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const currentMonth = new Date().toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  // Cálculos do dashboard
  const totalAmount = accounts.reduce((sum, account) => sum + account.amount, 0);
  const paidAmount = accounts
    .filter(account => account.isPaid)
    .reduce((sum, account) => sum + account.amount, 0);
  const pendingAmount = totalAmount - paidAmount;
  const paidCount = accounts.filter(account => account.isPaid).length;
  const pendingCount = accounts.length - paidCount;

  // Filtros
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "paid" && account.isPaid) ||
      (filterStatus === "pending" && !account.isPaid);
    const matchesCategory = filterCategory === "all" || account.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAddAccount = (newAccount: any) => {
    const account = {
      id: Date.now(),
      ...newAccount,
      isPaid: false,
      status: "pending"
    };
    setAccounts([...accounts, account]);
    setIsAddDialogOpen(false);
  };

  const handleTogglePaid = (accountId: number) => {
    setAccounts(accounts.map(account => 
      account.id === accountId 
        ? { ...account, isPaid: !account.isPaid, status: account.isPaid ? "pending" : "paid" }
        : account
    ));
  };

  const handleDeleteAccount = (accountId: number) => {
    setAccounts(accounts.filter(account => account.id !== accountId));
  };

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground capitalize">{currentMonth}</p>
          </div>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="transition-smooth hover:shadow-glow"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Conta
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total do Mês</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pago</CardTitle>
              <CheckCircle className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">
                R$ {paidAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {paidCount} {paidCount === 1 ? 'conta' : 'contas'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendente</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                R$ {pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                {pendingCount} {pendingCount === 1 ? 'conta' : 'contas'}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progresso</CardTitle>
              <TrendingUp className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                {Math.round((paidCount / accounts.length) * 100)}%
              </div>
              <p className="text-xs text-muted-foreground">
                {paidCount} de {accounts.length} pagas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-card animate-slide-up">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="Moradia">Moradia</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Alimentação">Alimentação</SelectItem>
                  <SelectItem value="Transporte">Transporte</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Educação">Educação</SelectItem>
                  <SelectItem value="Lazer">Lazer</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Accounts List */}
        <Card className="shadow-card animate-slide-up">
          <CardHeader>
            <CardTitle>Contas do Mês</CardTitle>
            <CardDescription>
              Gerencie suas contas mensais e acompanhe o status de pagamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAccounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhuma conta encontrada
                </div>
              ) : (
                filteredAccounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onTogglePaid={handleTogglePaid}
                    onDelete={handleDeleteAccount}
                  />
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
        />
      </div>
    </div>
  );
};

export default Dashboard;