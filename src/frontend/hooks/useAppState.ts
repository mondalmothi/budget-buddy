import { useState, useEffect } from 'react';
import { User, Expense, Category, LoginForm, RegisterForm, ExpenseForm } from '../types';
import { AuthService } from '../../backend/services/AuthService';
import { ExpenseService } from '../../backend/services/ExpenseService';
import { CategoryService } from '../../backend/services/CategoryService';
import { toast } from "@/hooks/use-toast";

export const useAppState = () => {
  // State management
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Form states
  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState<RegisterForm>({ username: '', email: '', password: '' });
  const [expenseForm, setExpenseForm] = useState<ExpenseForm>({ description: '', amount: '', category: '' });
  const [newCategory, setNewCategory] = useState('');
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  // Services
  const authService = new AuthService();
  const expenseService = new ExpenseService();
  const categoryService = new CategoryService();

  // Initialize categories on component mount
  useEffect(() => {
    categoryService.initializeCategories();
  }, []);

  // Get current data
  const expenses = expenseService.getUserExpenses(currentUser?.id || '');
  const categories = categoryService.getCategories();
  const monthlyExpenses = expenseService.getMonthlyExpenses(currentUser?.id || '');

  // Calculations
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const monthlyTotal = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Chart data
  const chartData = categories.map(cat => {
    const categoryExpenses = expenses.filter(exp => exp.category === cat.name);
    const total = categoryExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    return {
      name: cat.name,
      value: total,
      color: cat.color,
    };
  }).filter(item => item.value > 0);

  return {
    // State
    currentView,
    setCurrentView,
    isLoggedIn,
    setIsLoggedIn,
    currentUser,
    setCurrentUser,
    
    // Forms
    loginForm,
    setLoginForm,
    registerForm,
    setRegisterForm,
    expenseForm,
    setExpenseForm,
    newCategory,
    setNewCategory,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    editingExpense,
    setEditingExpense,

    // Data
    expenses,
    categories,
    monthlyExpenses,
    totalExpenses,
    monthlyTotal,
    chartData,

    // Services
    authService,
    expenseService,
    categoryService,

    // Toast utility
    toast
  };
};