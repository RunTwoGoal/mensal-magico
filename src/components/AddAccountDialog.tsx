import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AddAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (account: any) => void;
  isRecurringMode?: boolean;
}

export function AddAccountDialog({ open, onOpenChange, onAdd, isRecurringMode = false }: AddAccountDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDate: undefined as Date | undefined,
    day: "",
    category: "",
    repeatType: "forever",
    repeatCount: ""
  });

  const categories = [
    "Moradia",
    "Utilities", 
    "Alimentação",
    "Transporte",
    "Saúde",
    "Educação",
    "Lazer",
    "Outros"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRecurringMode) {
      if (!formData.name || !formData.amount || !formData.day || !formData.category) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      if (formData.repeatType === 'limited' && (!formData.repeatCount || parseInt(formData.repeatCount) <= 0)) {
        alert("Por favor, informe quantas vezes a conta deve se repetir.");
        return;
      }

      const account = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        day: parseInt(formData.day),
        category: formData.category,
        repeatType: formData.repeatType,
        repeatCount: formData.repeatType === 'limited' ? parseInt(formData.repeatCount) : null,
        remainingOccurrences: formData.repeatType === 'limited' ? parseInt(formData.repeatCount) : null
      };

      onAdd(account);
    } else {
      if (!formData.name || !formData.amount || !formData.dueDate || !formData.category) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      const account = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate.toISOString().split('T')[0],
        category: formData.category
      };

      onAdd(account);
    }
    
    // Reset form
    setFormData({
      name: "",
      amount: "",
      dueDate: undefined,
      day: "",
      category: "",
      repeatType: "forever",
      repeatCount: ""
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isRecurringMode ? "Nova Conta Recorrente" : "Nova Conta"}</DialogTitle>
          <DialogDescription>
            {isRecurringMode 
              ? "Configure uma nova conta que se repetirá automaticamente todos os meses."
              : "Adicione uma nova conta pontual ao seu controle mensal."
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da Conta *</Label>
            <Input
              id="name"
              placeholder="Ex: Aluguel, Energia Elétrica..."
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$) *</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0,00"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              required
            />
          </div>

          {isRecurringMode ? (
            <div className="space-y-2">
              <Label htmlFor="day">Dia do Vencimento *</Label>
              <Select value={formData.day} onValueChange={(value) => handleInputChange("day", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      Dia {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Data de Vencimento *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? (
                      format(formData.dueDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    ) : (
                      "Selecione uma data"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => handleInputChange("dueDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isRecurringMode && (
            <div className="space-y-3">
              <Label>Tipo de Recorrência</Label>
              <RadioGroup
                value={formData.repeatType}
                onValueChange={(value) => handleInputChange("repeatType", value)}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="forever" id="forever" />
                  <Label htmlFor="forever" className="text-sm">
                    Para sempre (sem limite)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="limited" id="limited" />
                  <Label htmlFor="limited" className="text-sm">
                    Número limitado de vezes
                  </Label>
                </div>
              </RadioGroup>

              {formData.repeatType === 'limited' && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="repeatCount">Quantas vezes? *</Label>
                  <Input
                    id="repeatCount"
                    type="number"
                    placeholder="Ex: 12 (para 1 ano)"
                    min="1"
                    value={formData.repeatCount}
                    onChange={(e) => handleInputChange("repeatCount", e.target.value)}
                    required={formData.repeatType === 'limited'}
                  />
                  <p className="text-xs text-muted-foreground">
                    A conta aparecerá por {formData.repeatCount || 0} meses consecutivos
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="transition-smooth hover:shadow-glow">
              {isRecurringMode ? "Criar Conta Recorrente" : "Adicionar Conta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}