import { User, Expense, Category } from '../../frontend/types';

// Singleton pattern for data management
export class DataStore {
  private static instance: DataStore;
  private users: User[] = [];
  private expenses: Expense[] = [];
  private categories: Category[] = [];

  private constructor() {}

  static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  // User management
  getUsers(): User[] {
    return this.users;
  }

  addUser(user: User): void {
    this.users.push(user);
  }

  // Expense management
  getExpenses(): Expense[] {
    return this.expenses;
  }

  addExpense(expense: Expense): void {
    this.expenses.push(expense);
  }

  updateExpense(updatedExpense: Expense): void {
    this.expenses = this.expenses.map(exp => 
      exp.id === updatedExpense.id ? updatedExpense : exp
    );
  }

  deleteExpense(expenseId: string): void {
    this.expenses = this.expenses.filter(exp => exp.id !== expenseId);
  }

  // Category management
  getCategories(): Category[] {
    return this.categories;
  }

  addCategory(category: Category): void {
    this.categories.push(category);
  }
}