import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

import Header from '../components/Dashboard/Header';
import SummaryCards from '../components/Dashboard/SummaryCards';
import ExpenseForm from '../components/Expenses/ExpenseForm';
import ExpenseTable from '../components/Expenses/ExpenseTable';
import ExpenseChart from '../components/Charts/ExpenseChart';
import CategoryManager from '../components/Categories/CategoryManager';

import { useAppState } from '../hooks/useAppState';

interface DashboardProps {
  appState: ReturnType<typeof useAppState>;
  onLogout: () => void;
  onAddExpense: (e: React.FormEvent) => void;
  onUpdateExpense: (e: React.FormEvent) => void;
  onEditExpense: (expense: any) => void;
  onDeleteExpense: (id: string) => void;
  onAddCategory: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  appState,
  onLogout,
  onAddExpense,
  onUpdateExpense,
  onEditExpense,
  onDeleteExpense,
  onAddCategory
}) => {
  const {
    currentUser,
    expenses,
    categories,
    monthlyExpenses,
    totalExpenses,
    monthlyTotal,
    chartData,
    expenseForm,
    setExpenseForm,
    newCategory,
    setNewCategory,
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    editingExpense,
    setEditingExpense
  } = appState;

  return (
    <div className="min-h-screen bg-background">
      <Header currentUser={currentUser} onLogout={onLogout} />

      <div className="container mx-auto px-4 py-8">
        <SummaryCards
          totalExpenses={totalExpenses}
          monthlyTotal={monthlyTotal}
          monthlyTransactions={monthlyExpenses.length}
          categoryCount={categories.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Expense Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Add Expense */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Expense Management</CardTitle>
                    <CardDescription>Track and manage your daily expenses</CardDescription>
                  </div>
                  <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-primary hover:opacity-90 gap-2">
                        <Plus className="h-4 w-4" />
                        Add Expense
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
                        <DialogDescription>
                          {editingExpense ? 'Update your expense details' : 'Record a new expense to track your spending'}
                        </DialogDescription>
                      </DialogHeader>
                      <ExpenseForm
                        expenseForm={expenseForm}
                        setExpenseForm={setExpenseForm}
                        categories={categories}
                        isEditing={!!editingExpense}
                        onSubmit={editingExpense ? onUpdateExpense : onAddExpense}
                        onCancel={() => {
                          setEditingExpense(null);
                          setExpenseForm({ description: '', amount: '', category: '' });
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
            </Card>

            {/* Expense Table */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Your latest spending activity</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseTable
                  expenses={expenses}
                  onEdit={onEditExpense}
                  onDelete={onDeleteExpense}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Expense Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
                <CardDescription>Visual breakdown of your expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ExpenseChart chartData={chartData} />
              </CardContent>
            </Card>

            {/* Category Management */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Manage your expense categories</CardDescription>
              </CardHeader>
              <CardContent>
                <CategoryManager
                  categories={categories}
                  newCategory={newCategory}
                  setNewCategory={setNewCategory}
                  onAddCategory={onAddCategory}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;