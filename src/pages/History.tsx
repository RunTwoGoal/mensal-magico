import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Filter
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AccountCard } from "@/components/AccountCard";

// Mock data - substitua pela chamada à sua API
const mockHistoricalData = {
  "2023-12": [
    { id: 1, name: "Aluguel", amount: 1200.00, dueDate: "2023-12-05", category: "Moradia", isRecurring: true, isPaid: true, status: "paid" },
    { id: 2, name: "Energia", amount: 165.30, dueDate: "2023-12-15", category: "Utilities", isRecurring: true, isPaid: true, status: "paid" }
  ],
  "2024-01": [
    { id: 3, name: "Aluguel", amount: 1200.00, dueDate: "2024-01-05", category: "Moradia", isRecurring: true, isPaid: true, status: "paid" },
    { id: 4, name: "Energia", amount: 180.50, dueDate: "2024-01-15", category: "Utilities", isRecurring: true, isPaid: false, status: "pending" },
    { id: 5, name: "Supermercado", amount: 450.00, dueDate: "2024-01-20", category: "Alimentação", isRecurring: false, isPaid: false, status: "pending" }
  ],
  "2024-02": [
    { id: 6, name: "Aluguel", amount: 1200.00, dueDate: "2024-02-05", category: "Moradia", isRecurring: true, isPaid: false, status: "future" },
    { id: 7, name: "Energia", amount: 175.00, dueDate: "2024-02-15", category: "Utilities", isRecurring: true, isPaid: false, status: "future" }
  ],
  "2024-03": [
    { id: 8, name: "Aluguel", amount: 1200.00, dueDate: "2024-03-05", category: "Moradia", isRecurring: true, isPaid: false, status: "future" },
    { id: 9, name: "Energia", amount: 175.00, dueDate: "2024-03-15", category: "Utilities", isRecurring: true, isPaid: false, status: "future" }
  ]
};

const History = () => {
  const [currentDate, setCurrentDate] = useState(new Date("2024-01-01"));
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const availableMonths = Object.keys(mockHistoricalData).sort();
  const currentMonthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
  const currentAccounts = mockHistoricalData[currentMonthKey as keyof typeof mockHistoricalData] || [];

  const monthName = currentDate.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const isCurrentMonth = () => {
    const today = new Date();
    return currentDate.getFullYear() === today.getFullYear() && 
           currentDate.getMonth() === today.getMonth();
  };

  const isFutureMonth = () => {
    const today = new Date();
    return currentDate > today;
  };

  // Filtros
  const filteredAccounts = currentAccounts.filter(account => {
    const matchesCategory = filterCategory === "all" || account.category === filterCategory;
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "paid" && account.isPaid) ||
      (filterStatus === "pending" && !account.isPaid) ||
      (filterStatus === "future" && account.status === "future");
    
    return matchesCategory && matchesStatus;
  });

  // Cálculos
  const totalAmount = currentAccounts.reduce((sum, account) => sum + account.amount, 0);
  const paidAmount = currentAccounts
    .filter(account => account.isPaid)
    .reduce((sum, account) => sum + account.amount, 0);
  const pendingAmount = totalAmount - paidAmount;
  const paidCount = currentAccounts.filter(account => account.isPaid).length;

  const handleTogglePaid = (accountId: number) => {
    // Esta função seria chamada apenas para o mês atual
    if (!isCurrentMonth()) return;
    
    // Aqui você faria a chamada para sua API para atualizar o status
    console.log(`Toggle paid status for account ${accountId}`);
  };

  const handleDeleteAccount = (accountId: number) => {
    // Esta função seria chamada apenas para o mês atual
    if (!isCurrentMonth()) return;
    
    // Aqui você faria a chamada para sua API para deletar a conta
    console.log(`Delete account ${accountId}`);
  };

  return (
    <div className="min-h-screen gradient-bg p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Histórico de Contas</h1>
            <p className="text-muted-foreground">Visualize suas contas passadas e futuras</p>
          </div>
        </div>

        {/* Month Navigation */}
        <Card className="shadow-card animate-slide-up">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
                className="transition-smooth hover:shadow-glow"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <CardTitle className="capitalize text-xl">{monthName}</CardTitle>
                <CardDescription>
                  {isFutureMonth() ? "Mês futuro" : isCurrentMonth() ? "Mês atual" : "Mês passado"}
                </CardDescription>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
                className="transition-smooth hover:shadow-glow"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        {currentAccounts.length > 0 && (
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
                <CardTitle className="text-sm font-medium">
                  {isFutureMonth() ? "Planejado" : "Pago"}
                </CardTitle>
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
                <CardTitle className="text-sm font-medium">
                  {isFutureMonth() ? "A Vencer" : "Pendente"}
                </CardTitle>
                <Clock className="h-4 w-4 text-warning" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-warning">
                  R$ {pendingAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentAccounts.length - paidCount} {currentAccounts.length - paidCount === 1 ? 'conta' : 'contas'}
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
                  {currentAccounts.length > 0 ? Math.round((paidCount / currentAccounts.length) * 100) : 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {paidCount} de {currentAccounts.length} contas
                </p>
              </CardContent>
            </Card>
          </div>
        )}

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
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="paid">Pagos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="future">Futuros</SelectItem>
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
            <CardTitle>Contas de {monthName}</CardTitle>
            <CardDescription>
              {isFutureMonth() 
                ? "Contas planejadas para este mês"
                : isCurrentMonth() 
                  ? "Suas contas do mês atual"
                  : "Histórico de contas pagas e pendentes"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAccounts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {currentAccounts.length === 0 
                    ? "Nenhuma conta cadastrada para este mês"
                    : "Nenhuma conta encontrada com os filtros aplicados"
                  }
                </div>
              ) : (
                filteredAccounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    account={account}
                    onTogglePaid={handleTogglePaid}
                    onDelete={handleDeleteAccount}
                    readOnly={!isCurrentMonth()}
                  />
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;