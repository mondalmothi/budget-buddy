import { Expense, ExpenseForm } from '../../frontend/types';
import { DataStore } from '../data/DataStore';

export class ExpenseService {
  private dataStore = DataStore.getInstance();

  validateExpenseForm(expenseData: ExpenseForm): { success: boolean; error?: string } {
    if (!expenseData.description.trim()) {
      return { success: false, error: "Please enter a description" };
    }

    const amount = parseFloat(expenseData.amount);
    if (!expenseData.amount || isNaN(amount) || amount <= 0) {
      return { success: false, error: "Please enter a valid amount greater than 0" };
    }

    if (!expenseData.category) {
      return { success: false, error: "Please select a category" };
    }

    return { success: true };
  }

  createExpense(userId: string, expenseData: ExpenseForm): { success: boolean; expense?: Expense; error?: string } {
    const validation = this.validateExpenseForm(expenseData);
    if (!validation.success) {
      return validation;
    }

    const newExpense: Expense = {
      id: Date.now().toString(),
      userId,
      description: expenseData.description.trim(),
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
      date: new Date().toISOString().split('T')[0],
    };

    this.dataStore.addExpense(newExpense);
    return { success: true, expense: newExpense };
  }

  updateExpense(expenseId: string, expenseData: ExpenseForm): { success: boolean; expense?: Expense; error?: string } {
    const validation = this.validateExpenseForm(expenseData);
    if (!validation.success) {
      return validation;
    }

    const expenses = this.dataStore.getExpenses();
    const existingExpense = expenses.find(exp => exp.id === expenseId);
    
    if (!existingExpense) {
      return { success: false, error: "Expense not found" };
    }

    const updatedExpense: Expense = {
      ...existingExpense,
      description: expenseData.description.trim(),
      amount: parseFloat(expenseData.amount),
      category: expenseData.category,
    };

    this.dataStore.updateExpense(updatedExpense);
    return { success: true, expense: updatedExpense };
  }

  deleteExpense(expenseId: string): { success: boolean; expense?: Expense; error?: string } {
    const expenses = this.dataStore.getExpenses();
    const expense = expenses.find(exp => exp.id === expenseId);
    
    if (!expense) {
      return { success: false, error: "Expense not found" };
    }

    this.dataStore.deleteExpense(expenseId);
    return { success: true, expense };
  }

  getUserExpenses(userId: string): Expense[] {
    return this.dataStore.getExpenses().filter(exp => exp.userId === userId);
  }

  getMonthlyExpenses(userId: string): Expense[] {
    const userExpenses = this.getUserExpenses(userId);
    const now = new Date();
    
    return userExpenses.filter(exp => {
      const expenseDate = new Date(exp.date);
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
    });
  }
}