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
  Filter,
  PiggyBank,
  AlertTriangle,
  Target,
  Edit3
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AccountCard } from "@/components/AccountCard";
import AppHeader from "@/components/AppHeader";

// Mock data - substitua pela chamada à sua API
const mockHistoricalData = {
  "2023-11": [
    { id: 1, name: "Aluguel", amount: 1200.00, dueDate: "2023-11-05", category: "Moradia", isRecurring: true, isPaid: true, status: "paid" },
    { id: 2, name: "Energia", amount: 155.30, dueDate: "2023-11-15", category: "Utilities", isRecurring: true, isPaid: true, status: "paid" }
  ],
  "2023-12": [
    { id: 3, name: "Aluguel", amount: 1200.00, dueDate: "2023-12-05", category: "Moradia", isRecurring: true, isPaid: true, status: "paid" },
    { id: 4, name: "Energia", amount: 165.30, dueDate: "2023-12-15", category: "Utilities", isRecurring: true, isPaid: true, status: "paid" }
  ],
  "2024-01": [
    { id: 5, name: "Aluguel", amount: 1200.00, dueDate: "2024-01-05", category: "Moradia", isRecurring: true, isPaid: true, status: "paid" },
    { id: 6, name: "Energia", amount: 180.50, dueDate: "2024-01-15", category: "Utilities", isRecurring: true, isPaid: false, status: "pending" },
    { id: 7, name: "Supermercado", amount: 450.00, dueDate: "2024-01-20", category: "Alimentação", isRecurring: false, isPaid: false, status: "pending" }
  ],
  "2024-02": [
    { id: 8, name: "Aluguel", amount: 1200.00, dueDate: "2024-02-05", category: "Moradia", isRecurring: true, isPaid: false, status: "future" },
    { id: 9, name: "Energia", amount: 175.00, dueDate: "2024-02-15", category: "Utilities", isRecurring: true, isPaid: false, status: "future" },
    { id: 10, name: "Internet", amount: 89.90, dueDate: "2024-02-20", category: "Utilities", isRecurring: true, isPaid: false, status: "future" }
  ],
  "2024-03": [
    { id: 11, name: "Aluguel", amount: 1200.00, dueDate: "2024-03-05", category: "Moradia", isRecurring: true, isPaid: false, status: "future" },
    { id: 12, name: "Energia", amount: 175.00, dueDate: "2024-03-15", category: "Utilities", isRecurring: true, isPaid: false, status: "future" },
    { id: 13, name: "Internet", amount: 89.90, dueDate: "2024-03-20", category: "Utilities", isRecurring: true, isPaid: false, status: "future" }
  ],
  "2024-04": [
    { id: 14, name: "Aluguel", amount: 1200.00, dueDate: "2024-04-05", category: "Moradia", isRecurring: true, isPaid: false, status: "future" },
    { id: 15, name: "Energia", amount: 175.00, dueDate: "2024-04-15", category: "Utilities", isRecurring: true, isPaid: false, status: "future" },
    { id: 16, name: "Internet", amount: 89.90, dueDate: "2024-04-20", category: "Utilities", isRecurring: true, isPaid: false, status: "future" }
  ],
  "2024-05": [
    { id: 17, name: "Aluguel", amount: 1200.00, dueDate: "2024-05-05", category: "Moradia", isRecurring: true, isPaid: false, status: "future" },
    { id: 18, name: "Energia", amount: 175.00, dueDate: "2024-05-15", category: "Utilities", isRecurring: true, isPaid: false, status: "future" },
    { id: 19, name: "Internet", amount: 89.90, dueDate: "2024-05-20", category: "Utilities", isRecurring: true, isPaid: false, status: "future" }
  ],
  "2024-06": [
    { id: 20, name: "Aluguel", amount: 1200.00, dueDate: "2024-06-05", category: "Moradia", isRecurring: true, isPaid: false, status: "future" },
    { id: 21, name: "Energia", amount: 175.00, dueDate: "2024-06-15", category: "Utilities", isRecurring: true, isPaid: false, status: "future" },
    { id: 22, name: "Internet", amount: 89.90, dueDate: "2024-06-20", category: "Utilities", isRecurring: true, isPaid: false, status: "future" }
  ]
};

// Mock data para orçamentos mensais - substitua pela chamada à sua API
const mockMonthlyBudgets = {
  "2023-11": 2600,
  "2023-12": 2800,
  "2024-01": 3000,
  "2024-02": 3200,
  "2024-03": 3000,
  "2024-04": 3000,
  "2024-05": 3000,
  "2024-06": 3000
};

const History = () => {
  const [currentDate, setCurrentDate] = useState(new Date("2024-01-01"));
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [monthlyBudgets, setMonthlyBudgets] = useState(mockMonthlyBudgets);
  const [isEditingBudget, setIsEditingBudget] = useState(false);

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

  // Cálculos do orçamento para o mês atual
  const currentMonthBudget = monthlyBudgets[currentMonthKey as keyof typeof monthlyBudgets] || 3000;
  const remainingBudget = currentMonthBudget - totalAmount;
  const budgetUsedPercentage = totalAmount > 0 ? Math.min((totalAmount / currentMonthBudget) * 100, 100) : 0;
  const isOverBudget = totalAmount > currentMonthBudget;

  const updateMonthlyBudget = (newBudget: number) => {
    setMonthlyBudgets(prev => ({
      ...prev,
      [currentMonthKey]: newBudget
    }));
    setIsEditingBudget(false);
  };

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
    <div className="min-h-screen gradient-bg">
      <AppHeader />
      <div className="p-4">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contas</h1>
            <p className="text-muted-foreground">Visualize e gerencie suas contas passadas, presentes e futuras</p>
          </div>
          {isFutureMonth() && (
            <div className="flex items-center gap-2 text-accent">
              <Calendar className="w-5 h-5" />
              <Badge variant="outline" className="text-accent border-accent">
                Planejamento Futuro
              </Badge>
            </div>
          )}
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

        {/* Budget Section */}
        {currentAccounts.length > 0 && (
          <Card className="shadow-card animate-fade-in border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-primary" />
                  Orçamento de {monthName}
                </div>
                {isCurrentMonth() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingBudget(!isEditingBudget)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Orçamento Disponível */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Valor Disponível</label>
                  {isEditingBudget && isCurrentMonth() ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={currentMonthBudget}
                        onChange={(e) => updateMonthlyBudget(Number(e.target.value))}
                        className="text-lg font-bold"
                      />
                      <Button
                        size="sm"
                        onClick={() => setIsEditingBudget(false)}
                      >
                        OK
                      </Button>
                    </div>
                  ) : (
                    <div className="text-2xl font-bold text-primary">
                      R$ {currentMonthBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  )}
                </div>

                {/* Saldo Restante */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isFutureMonth() ? "Saldo Previsto" : "Saldo Restante"}
                  </label>
                  <div className={`text-2xl font-bold ${
                    isOverBudget ? 'text-destructive' : 'text-success'
                  }`}>
                    R$ {Math.abs(remainingBudget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    {isOverBudget && <span className="text-sm ml-1">(déficit)</span>}
                  </div>
                </div>

                {/* Percentual Usado */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {isFutureMonth() ? "Orçamento Planejado" : "Orçamento Usado"}
                  </label>
                  <div className={`text-2xl font-bold ${
                    budgetUsedPercentage > 90 ? 'text-warning' : 
                    budgetUsedPercentage > 100 ? 'text-destructive' : 'text-accent'
                  }`}>
                    {budgetUsedPercentage.toFixed(1)}%
                  </div>
                </div>

                {/* Status Financeiro */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex items-center gap-2">
                    {isOverBudget ? (
                      <>
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <span className="text-destructive font-semibold">
                          {isFutureMonth() ? "Acima do Planejado" : "Acima do Orçamento"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Target className="h-5 w-5 text-success" />
                        <span className="text-success font-semibold">
                          {isFutureMonth() ? "Dentro do Planejado" : "Dentro do Orçamento"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Barra de Progresso */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {isFutureMonth() ? "Progresso do Planejamento" : "Progresso do Orçamento"}
                  </span>
                  <span>{budgetUsedPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      budgetUsedPercentage > 100 ? 'bg-destructive' :
                      budgetUsedPercentage > 90 ? 'bg-warning' : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min(budgetUsedPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Mensagem de Status */}
              {isOverBudget && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="font-medium">
                      {isFutureMonth() 
                        ? `Planejamento: R$ ${Math.abs(remainingBudget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} acima do orçamento!`
                        : `Você ficou R$ ${Math.abs(remainingBudget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} acima do orçamento!`
                      }
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
            <CardTitle className="flex items-center justify-between">
              <span>Contas de {monthName}</span>
              {isFutureMonth() && (
                <Badge variant="outline" className="text-accent border-accent">
                  <Calendar className="w-4 h-4 mr-2" />
                  Planejamento
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {isFutureMonth() 
                ? "Contas planejadas para este mês - você poderá editá-las quando chegarem"
                : isCurrentMonth() 
                  ? "Suas contas do mês atual - clique para marcar como pago"
                  : "Histórico de contas pagas e pendentes"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAccounts.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground mb-4">
                    {currentAccounts.length === 0 
                      ? (isFutureMonth() 
                          ? "Nenhuma conta planejada para este mês ainda"
                          : "Nenhuma conta registrada para este mês") 
                      : "Nenhuma conta encontrada com os filtros aplicados"
                    }
                  </div>
                  {currentAccounts.length === 0 && !isFutureMonth() && (
                    <div className="space-x-2">
                      <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                        Ir para Dashboard
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                filteredAccounts.map((account) => (
                  <div key={account.id} className={isFutureMonth() ? "opacity-75" : ""}>
                    <AccountCard
                      account={account}
                      onTogglePaid={handleTogglePaid}
                      onDelete={handleDeleteAccount}
                      readOnly={!isCurrentMonth()}
                    />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default History;