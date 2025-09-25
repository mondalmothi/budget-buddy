import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExpenseForm as ExpenseFormType, Category } from '../../types';

interface ExpenseFormProps {
  expenseForm: ExpenseFormType;
  setExpenseForm: (form: ExpenseFormType) => void;
  categories: Category[];
  isEditing: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  expenseForm,
  setExpenseForm,
  categories,
  isEditing,
  onSubmit,
  onCancel
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="What did you spend on?"
          value={expenseForm.description}
          onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={expenseForm.amount}
          onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select 
          value={expenseForm.category} 
          onValueChange={(value) => setExpenseForm({...expenseForm, category: value})}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          {isEditing ? 'Update Expense' : 'Add Expense'}
        </Button>
        {isEditing && onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;