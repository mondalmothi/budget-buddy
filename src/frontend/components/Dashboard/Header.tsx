import React from 'react';
import { Button } from "@/components/ui/button";
import { Wallet, LogOut } from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  currentUser: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  return (
    <header className="border-b bg-surface/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wallet className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Budget Buddy</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground">Welcome, {currentUser?.username}!</span>
          <Button variant="outline" onClick={onLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;