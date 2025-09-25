import React from 'react';
import AuthPage from '../frontend/components/Auth/AuthPage';
import Dashboard from '../frontend/pages/Dashboard';
import { useAppState } from '../frontend/hooks/useAppState';

const BudgetBuddy = () => {
  const appState = useAppState();
  const {
    currentView,
    setCurrentView,
    isLoggedIn,
    setIsLoggedIn,
    currentUser,
    setCurrentUser,
    loginForm,
    setLoginForm,
    registerForm,
    setRegisterForm,
    expenseForm,
    setExpenseForm,
    editingExpense,
    setEditingExpense,
    setIsAddExpenseOpen,
    authService,
    expenseService,
    categoryService,
    toast
  } = appState;

  // Authentication handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = authService.validateLogin(loginForm);
    
     if (result.success && result.user) {
      setCurrentUser(result.user);
      setIsLoggedIn(true);
      toast({
        title: "Welcome back!",
        description: `Hello ${result.user.username}, ready to manage your budget?`,
      });
    } else {
      toast({
        title: "Login failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const result = authService.validateRegistration(registerForm);
    
     if (result.success && result.user) {
      setCurrentUser(result.user);
      setIsLoggedIn(true);
      setRegisterForm({ username: '', email: '', password: '' });
      toast({
        title: "Account created!",
        description: `Welcome to Budget Buddy, ${result.user.username}!`,
      });
    } else {
      toast({
        title: "Registration failed",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    
    // Reset all forms
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ username: '', email: '', password: '' });
    setExpenseForm({ description: '', amount: '', category: '' });
    setEditingExpense(null);
    setIsAddExpenseOpen(false);
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // Expense handlers
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const result = expenseService.createExpense(currentUser.id, expenseForm);
    
    if (result.success && result.expense) {
      setExpenseForm({ description: '', amount: '', category: '' });
      setIsAddExpenseOpen(false);
      toast({
        title: "Expense added!",
        description: `Added $${result.expense.amount.toFixed(2)} for ${result.expense.description}`,
      });
    } else {
      toast({
        title: "Invalid expense",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleEditExpense = (expense: any) => {
    setEditingExpense(expense);
    setExpenseForm({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
    });
    setIsAddExpenseOpen(true);
  };

  const handleUpdateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpense) return;

    const result = expenseService.updateExpense(editingExpense.id, expenseForm);
    
    if (result.success && result.expense) {
      setExpenseForm({ description: '', amount: '', category: '' });
      setEditingExpense(null);
      setIsAddExpenseOpen(false);
      toast({
        title: "Expense updated!",
        description: `Updated ${result.expense.description}`,
      });
    } else {
      toast({
        title: "Invalid expense",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  const handleDeleteExpense = (id: string) => {
    const result = expenseService.deleteExpense(id);
    
    if (result.success) {
      toast({
        title: "Expense deleted",
        description: result.expense 
          ? `Removed ${result.expense.description} ($${result.expense.amount.toFixed(2)})`
          : "The expense has been removed from your records.",
      });
    }
  };

  const handleAddCategory = () => {
    const result = categoryService.addCategory(appState.newCategory);
    
    if (result.success && result.category) {
      appState.setNewCategory('');
      toast({
        title: "Category added!",
        description: `New category "${result.category.name}" is now available`,
      });
    } else {
      toast({
        title: "Invalid category",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  // Main render
  if (!isLoggedIn) {
    return (
      <AuthPage
        currentView={currentView}
        setCurrentView={setCurrentView}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
    );
  }

  return (
    <Dashboard
      appState={appState}
      onLogout={handleLogout}
      onAddExpense={handleAddExpense}
      onUpdateExpense={handleUpdateExpense}
      onEditExpense={handleEditExpense}
      onDeleteExpense={handleDeleteExpense}
      onAddCategory={handleAddCategory}
    />
  );
};

export default BudgetBuddy;