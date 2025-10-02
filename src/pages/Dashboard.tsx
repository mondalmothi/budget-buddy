import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { formatCurrency } from '@/utils/currency';
import { TransactionDialog } from '@/components/TransactionDialog';
import { CategoryManager } from '@/components/CategoryManager';
import { Plus, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

const Dashboard = () => {
  const { user } = useAuth();
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('monthly');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userCountry, setUserCountry] = useState('United States');

  // Fetch user profile
  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  useEffect(() => {
    if (profile) {
      setUserCountry(profile.country);
    }
  }, [profile]);

  // Fetch categories
  const { data: categories = [], refetch: refetchCategories } = useQuery({
    queryKey: ['categories', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user!.id)
        .order('name');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Fetch transactions based on time period
  const { data: transactions = [], refetch: refetchTransactions } = useQuery({
    queryKey: ['transactions', user?.id, timePeriod],
    queryFn: async () => {
      const now = new Date();
      let startDate = new Date();

      switch (timePeriod) {
        case 'daily':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'weekly':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'monthly':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'yearly':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user!.id)
        .gte('date', startDate.toISOString())
        .order('date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  // Calculate summary
  const summary = transactions.reduce(
    (acc, transaction) => {
      const amount = parseFloat(transaction.amount.toString());
      if (transaction.type === 'Income') {
        acc.income += amount;
      } else {
        acc.expense += amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  const balance = summary.income - summary.expense;

  // Prepare chart data
  const expensesByCategory = transactions
    .filter((t) => t.type === 'Expense')
    .reduce((acc, transaction) => {
      const amount = parseFloat(transaction.amount.toString());
      acc[transaction.category] = (acc[transaction.category] || 0) + amount;
      return acc;
    }, {} as Record<string, number>);

  const chartData = Object.entries(expensesByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  const handleAddTransaction = async (data: any) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user!.id,
          ...data,
        });

      if (error) throw error;

      toast.success('Transaction added successfully');
      refetchTransactions();
    } catch (error) {
      toast.error('Failed to add transaction');
    }
  };

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="container py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {profile?.username || 'User'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={timePeriod} onValueChange={(value: TimePeriod) => setTimePeriod(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {formatCurrency(summary.income, userCountry)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(summary.expense, userCountry)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(balance, userCountry)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value, userCountry)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between border-b pb-2">
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category} • {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <p className={`font-semibold ${transaction.type === 'Income' ? 'text-success' : 'text-destructive'}`}>
                      {transaction.type === 'Income' ? '+' : '-'}
                      {formatCurrency(parseFloat(transaction.amount.toString()), userCountry)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                  No transactions yet
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Manager */}
      <CategoryManager categories={categories} onCategoriesChange={refetchCategories} />

      {/* Transaction Dialog */}
      <TransactionDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddTransaction}
        categories={categories}
        mode="create"
      />
    </div>
  );
};

export default Dashboard;
