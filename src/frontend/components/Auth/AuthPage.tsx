import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { LoginForm as LoginFormType, RegisterForm as RegisterFormType } from '../../types';

interface AuthPageProps {
  currentView: 'login' | 'register';
  setCurrentView: (view: 'login' | 'register') => void;
  loginForm: LoginFormType;
  setLoginForm: (form: LoginFormType) => void;
  registerForm: RegisterFormType;
  setRegisterForm: (form: RegisterFormType) => void;
  onLogin: (e: React.FormEvent) => void;
  onRegister: (e: React.FormEvent) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({
  currentView,
  setCurrentView,
  loginForm,
  setLoginForm,
  registerForm,
  setRegisterForm,
  onLogin,
  onRegister
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-primary p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Wallet className="h-12 w-12 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-primary-foreground mb-2">Budget Buddy</h1>
          <p className="text-primary-foreground/80">Take control of your finances</p>
        </div>

        <Card className="backdrop-blur-sm bg-card/95 shadow-elevated">
          <CardHeader>
            <CardTitle>{currentView === 'login' ? 'Welcome Back' : 'Create Account'}</CardTitle>
            <CardDescription>
              {currentView === 'login' 
                ? 'Sign in to manage your expenses' 
                : 'Join Budget Buddy to start tracking your finances'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentView === 'login' ? (
              <LoginForm
                loginForm={loginForm}
                setLoginForm={setLoginForm}
                onSubmit={onLogin}
                onSwitchToRegister={() => setCurrentView('register')}
              />
            ) : (
              <RegisterForm
                registerForm={registerForm}
                setRegisterForm={setRegisterForm}
                onSubmit={onRegister}
                onSwitchToLogin={() => setCurrentView('login')}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;