import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, PieChart } from 'lucide-react';

interface SummaryCardsProps {
  totalExpenses: number;
  monthlyTotal: number;
  monthlyTransactions: number;
  categoryCount: number;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalExpenses,
  monthlyTotal,
  monthlyTransactions,
  categoryCount
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-success text-success-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <DollarSign className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <p className="text-xs opacity-80">All time total</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-primary text-primary-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <TrendingUp className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${monthlyTotal.toFixed(2)}</div>
          <p className="text-xs opacity-80">{monthlyTransactions} transactions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Categories</CardTitle>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categoryCount}</div>
          <p className="text-xs text-muted-foreground">Active categories</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SummaryCards;