import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/currency';
import { format } from 'date-fns';
import { TrendingDown } from 'lucide-react';

const RecentExpenses = () => {
  const { user } = useAuth();
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

  // Fetch recent 20 expenses
  const { data: recentExpenses = [] } = useQuery({
    queryKey: ['recent-expenses', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user!.id)
        .eq('type', 'Expense')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalExpenses = recentExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount.toString()),
    0
  );

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Recent Expenses</h1>
        <p className="text-muted-foreground">
          Your 20 most recent expense transactions
        </p>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Recent Expenses</CardTitle>
          <TrendingDown className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {formatCurrency(totalExpenses, userCountry)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last {recentExpenses.length} expense{recentExpenses.length !== 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Expenses List */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{expense.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="px-2 py-0.5 rounded-full bg-muted">
                        {expense.category}
                      </span>
                      <span>•</span>
                      <span>{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-destructive">
                      -{formatCurrency(parseFloat(expense.amount.toString()), userCountry)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(expense.created_at), 'HH:mm')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                No expense transactions yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecentExpenses;
