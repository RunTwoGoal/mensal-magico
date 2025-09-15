import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  CreditCard, 
  TrendingUp, 
  CheckCircle, 
  Clock,
  Filter,
  Search,
  PiggyBank,
  AlertTriangle,
  Target,
  Edit3,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddAccountDialog } from "@/components/AddAccountDialog";
import { AccountCard } from "@/components/AccountCard";
import AppHeader from "@/components/AppHeader";
import api from "@/api";

// Types
type ApiAccount = {
  id: string | number;
  name: string;
  amount: number;
  dueDate?: string;
  category?: string;
  isRecurring?: boolean;
  paid?: boolean;
  isPaid?: boolean;
  status?: "paid" | "pending";
};

type UiAccount = {
  id: string | number;
  name: string;
  amount: number;
  dueDate: string;
  category: string;
  isRecurring: boolean;
  isPaid: boolean;
  status: "paid" | "pending";
};

const toUi = (a: ApiAccount, index?: number): UiAccount => {
  const dueDate = a.dueDate ?? "";
  const isPaid = a.isPaid ?? a.paid ?? false;
  const isRecurring = a.isRecurring ?? false;
  const status = a.status ?? (isPaid ? "paid" : "pending");
  
  let id = a.id;
  // if (isNaN(id) || id <= 0) {
  //   id = Date.now() + (index ?? 0);
  //   console.warn(`ID inválido detectado para conta "${a.name}", usando ID gerado: ${id}`);
  // }
  
  return {
    id,
    name: a.name || "Conta sem nome",
    amount: Number(a.amount ?? 0) || 0,
    dueDate,
    category: a.category ?? "Outros",
    isRecurring,
    isPaid,
    status,
  };
};

const Accounts = () => {
  // State management
  const [currentDate, setCurrentDate] = useState(new Date());
  const [accounts, setAccounts] = useState<UiAccount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [isLoadingBudget, setIsLoadingBudget] = useState(true);

  // Date calculations
  const monthYear = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = String(currentDate.getMonth() + 1).padStart(2, "0");
    return `${y}-${m}`;
  }, [currentDate]);

  const monthName = currentDate.toLocaleDateString('pt-BR', { 
    month: 'long', 
    year: 'numeric' 
  });

  const isCurrentMonth = () => {
    const today = new Date();
    return currentDate.getFullYear() === today.getFullYear() && 
           currentDate.getMonth() === today.getMonth();
  };

  const isFutureMonth = () => {
    const today = new Date();
    return currentDate > today;
  };

  // Month navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  // Data fetching
  useEffect(() => {
    const fetchAccounts = async () => {
      setIsLoadingAccounts(true);
      try {
        const { data } = await api.get<ApiAccount[]>("/account/", {
          params: { month_year: monthYear },
        });
        console.log("Contas carregadas:", data);
        const list: ApiAccount[] = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.accounts)
        ? (data as any).accounts
        : [];

        setAccounts(list.map((account, index) => toUi(account, index)));
      } catch (e: any) {
        console.error("Erro ao carregar contas:", e);
      } finally {
        setIsLoadingAccounts(false);
      }
    };
    fetchAccounts();

    const fetchBudget = async () => {
      setIsLoadingBudget(true);
      try {
        const { data } = await api.get<{ budget: { amount: number } }>("/budgets/", { params: { month_year: monthYear } });
        console.log("Orçamento carregado:", data);
        setMonthlyBudget(data.budget.amount ?? 0);
      } catch (e: any) {
        console.error("Erro ao carregar orçamento:", e);
        if (e.response?.status === 404) {
          setMonthlyBudget(0);
        }
      } finally {
        setIsLoadingBudget(false);
      }
    };
    if (!isFutureMonth())
      fetchBudget();
    else
      setMonthlyBudget(0);
  }, [monthYear]);

  // Calculations
  const totalAmount = accounts.reduce((sum, account) => sum + account.amount, 0);
  const paidAmount = accounts
    .filter(account => account.isPaid)
    .reduce((sum, account) => sum + account.amount, 0);
  const pendingAmount = totalAmount - paidAmount;
  const paidCount = accounts.filter(account => account.isPaid).length;
  const pendingCount = accounts.length - paidCount;

  // Budget calculations
  const remainingBudget = monthlyBudget - totalAmount;
  const budgetUsedPercentage = Math.min((totalAmount / monthlyBudget) * 100, 100);
  const isOverBudget = totalAmount > monthlyBudget;

  // Filters
  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "paid" && account.isPaid) ||
      (filterStatus === "pending" && !account.isPaid);
    const matchesCategory = filterCategory === "all" || account.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handlers
  const handleAddAccount = async (newAccount: any) => {
    
    try {
      console.log("Dados enviados para API:", newAccount);
      const {data} = await api.post<ApiAccount>("/account/insert", { ...newAccount } );
      console.log("Resposta completa da API:", data);
      
      let apiAccount: ApiAccount;
      if (data && typeof data === 'object') {
        if ('account' in data) {
          apiAccount = (data as any).account;
          console.log("Conta extraída de data.account:", apiAccount);
        } else {
          apiAccount = data as ApiAccount;
          console.log("Conta extraída diretamente de data:", apiAccount);
        }
      } else {
        throw new Error("Resposta da API inválida");
      }

      if (!apiAccount.id || (typeof apiAccount.id !== 'string' && typeof apiAccount.id !== 'number')) {
        console.error("ID inválido retornado pela API:", apiAccount.id);
        throw new Error("API retornou ID inválido");
      }

      console.log("ID da conta:", apiAccount.id, "Tipo:", typeof apiAccount.id);
      
      const processedAccount = toUi(apiAccount);
      console.log("Conta processada:", processedAccount);
      
      const account = {
        ...processedAccount,
        isPaid: false,
        status: "pending" as const
      };
      
      setAccounts([...accounts, account]);
      setIsAddDialogOpen(false);
    }
    catch (e) {
      console.error("Erro ao adicionar conta:", e);
    }
  };

  const handleTogglePaid = async (accountId: string | number) => {
    
    try{
      setAccounts(accounts.map(account => 
      account.id === accountId 
        ? { ...account, isPaid: !account.isPaid, status: account.isPaid ? "pending" : "paid" }
        : account
      ));
      const stat = !!accounts.find(a => a.id === accountId)?.isPaid;
      const {data} = await api.post<ApiAccount>(`account/${accountId}/pay`, null, { params: {status: !stat} });
      console.log("Conta atualizada:", data);
      if (!data) throw new Error("Resposta inválida da API");
    }
    catch(e){
      console.error("Erro ao atualizar conta:", e);
      setAccounts(accounts.map(account => 
      account.id === accountId 
        ? { ...account, isPaid: !account.isPaid, status: account.isPaid ? "pending" : "paid" }
        : account
    ));
    }
  };

  const handleDeleteAccount = async (accountId: string | number) => {
    
    try{
      const {data} = await api.delete(`account/${accountId}/delete`);
      console.log("Conta deletada:", data);
      if (!data) throw new Error("Resposta inválida da API");
      if (data["success"]=== true)
        setAccounts(accounts.filter(account => account.id !== accountId));
    }
    catch(e){
      console.error("Erro ao deletar conta:", e);
    }
  };

  const handleBudgetSave = async () => {
    if (!monthlyBudget || isNaN(monthlyBudget)) {
      console.error("Valor de orçamento inválido");
      return;
    }
    try {
      const {data} = await api.post("/budgets/update",null, {params:{budget: monthlyBudget, month_year:monthYear }});
      console.log("Orçamento salvo:", data);
      if (!data) throw new Error("Resposta inválida da API");
      setIsEditingBudget(false);
    } catch (e) {
      console.error("Erro ao salvar orçamento:", e);
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      <AppHeader />
      <div className="p-4">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Contas
            </h1>
             <p className="text-muted-foreground capitalize">
               {monthName}
             </p>
           </div>
           
           <div className="flex items-center gap-2">
             {isFutureMonth() && (
               <Badge variant="outline" className="text-accent border-accent">
                 <Calendar className="w-4 h-4 mr-1" />
                 Planejamento
               </Badge>
             )}
             
             <Button 
               onClick={() => setIsAddDialogOpen(true)}
               className="transition-smooth hover:shadow-glow"
             >
               <Plus className="mr-2 h-4 w-4" />
               Nova Conta
             </Button>
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
                  {isFutureMonth() ? "Planejamento futuro" : isCurrentMonth() ? "Mês atual" : "Mês passado"}
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
         {(accounts.length > 0 || isLoadingAccounts) && (
           <Card className="shadow-card animate-fade-in border-l-4 border-l-primary">
             <CardHeader>
               <CardTitle className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <PiggyBank className="h-5 w-5 text-primary" />
                   Orçamento de {monthName}
                 </div>
                 <Button
                   variant="ghost"
                   size="sm"
                   onClick={() => setIsEditingBudget(!isEditingBudget)}
                 >
                   <Edit3 className="h-4 w-4" />
                 </Button>
               </CardTitle>
             </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingBudget ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-8 w-32" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Orçamento Disponível */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Valor Disponível</label>
                      {isEditingBudget ? (
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={monthlyBudget}
                            onChange={(e) => setMonthlyBudget(Number(e.target.value))}
                            className="text-lg font-bold"
                          />
                          <Button
                            size="sm"
                            onClick={handleBudgetSave}
                          >
                            OK
                          </Button>
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-primary">
                          R$ {monthlyBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                        {isFinite(budgetUsedPercentage) ? budgetUsedPercentage.toFixed(1) : '0.0'}%
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
                      <span>{isFinite(budgetUsedPercentage) ? budgetUsedPercentage.toFixed(1) : '0.0'}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          budgetUsedPercentage > 100 ? 'bg-destructive' :
                          budgetUsedPercentage > 90 ? 'bg-warning' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(isFinite(budgetUsedPercentage) ? budgetUsedPercentage : 0, 100)}%` }}
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
                            : `Atenção: Você está R$ ${Math.abs(remainingBudget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} acima do orçamento!`
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        {(accounts.length > 0 || isLoadingAccounts) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up">
            {isLoadingAccounts ? (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-4 rounded" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-3 w-16" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <>
                <Card className="shadow-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total do Mês</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      R$ {totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {accounts.length} {accounts.length === 1 ? 'conta' : 'contas'}
                    </p>
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
                      {accounts.length > 0 ? Math.round((paidCount / accounts.length) * 100) : 0}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isFutureMonth() ? "Planejamento" : "Contas pagas"}
                    </p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 animate-fade-in">
          <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar contas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-36">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="paid">
                    {isFutureMonth() ? "Planejado" : "Pagas"}
                  </SelectItem>
                  <SelectItem value="pending">
                    {isFutureMonth() ? "A Planejar" : "Pendentes"}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Categorias</SelectItem>
                  <SelectItem value="Moradia">Moradia</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Alimentação">Alimentação</SelectItem>
                  <SelectItem value="Transporte">Transporte</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Lazer">Lazer</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>

        {/* Accounts List */}
        <div className="space-y-4 animate-slide-up">
          {isLoadingAccounts ? (
            [...Array(3)].map((_, i) => (
              <Card key={i} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-24" />
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : filteredAccounts.length > 0 ? (
            filteredAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                 onTogglePaid={handleTogglePaid}
                 onDelete={handleDeleteAccount}
               />
             ))
          ) : accounts.length > 0 ? (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Filter className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground mb-2">
                  Nenhuma conta encontrada
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  Tente ajustar os filtros ou termo de busca
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CreditCard className="h-16 w-16 text-muted-foreground mb-4" />
                <p className="text-xl font-medium text-muted-foreground mb-2">
                  {isFutureMonth() ? "Nenhuma conta planejada" : "Nenhuma conta encontrada"}
                </p>
                 <p className="text-sm text-muted-foreground text-center mb-4">
                   Comece adicionando uma nova conta para gerenciar suas finanças
                 </p>
                 <Button onClick={() => setIsAddDialogOpen(true)}>
                   <Plus className="mr-2 h-4 w-4" />
                   Adicionar Primeira Conta
                 </Button>
              </CardContent>
            </Card>
          )}
        </div>
        </div>
      </div>

       {/* Add Account Dialog */}
       <AddAccountDialog
         open={isAddDialogOpen}
         onOpenChange={setIsAddDialogOpen}
         onAdd={handleAddAccount}
       />
    </div>
  );
};

export default Accounts;