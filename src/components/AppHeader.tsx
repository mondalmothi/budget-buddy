import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Wallet } from 'lucide-react';

export const AppHeader = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Wallet className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">ExpenseTracker</span>
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost">Dashboard</Button>
          </Link>
          <Link to="/transactions">
            <Button variant="ghost">Transactions</Button>
          </Link>
          <Link to="/recent-expenses">
            <Button variant="ghost">Recent Expenses</Button>
          </Link>
          <ThemeToggle />
          <Button variant="outline" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
          </Button>
        </nav>
      </div>
    </header>
  );
};
