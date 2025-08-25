import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface EditRecurringAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (account: any) => void;
  account: any;
}

export function EditRecurringAccountDialog({ open, onOpenChange, onSave, account }: EditRecurringAccountDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
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

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        amount: account.amount.toString(),
        day: account.day.toString(),
        category: account.category,
        repeatType: account.repeatType,
        repeatCount: account.repeatCount?.toString() || ""
      });
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.amount || !formData.day || !formData.category) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (formData.repeatType === 'limited' && (!formData.repeatCount || parseInt(formData.repeatCount) <= 0)) {
      alert("Por favor, informe quantas vezes a conta deve se repetir.");
      return;
    }

    const updatedAccount = {
      name: formData.name,
      amount: parseFloat(formData.amount),
      day: parseInt(formData.day),
      category: formData.category,
      repeatType: formData.repeatType,
      repeatCount: formData.repeatType === 'limited' ? parseInt(formData.repeatCount) : null,
      remainingOccurrences: formData.repeatType === 'limited' 
        ? Math.max(0, parseInt(formData.repeatCount) - (account.repeatCount - (account.remainingOccurrences || 0)))
        : null
    };

    onSave(updatedAccount);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Conta Recorrente</DialogTitle>
          <DialogDescription>
            Modifique os dados da sua conta recorrente. As alterações afetarão apenas as próximas ocorrências.
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="transition-smooth hover:shadow-glow">
              Salvar Alterações
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}