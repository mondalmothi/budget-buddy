import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterForm as RegisterFormType } from '../../types';

interface RegisterFormProps {
  registerForm: RegisterFormType;
  setRegisterForm: (form: RegisterFormType) => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  registerForm,
  setRegisterForm,
  onSubmit,
  onSwitchToLogin
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Your name"
          value={registerForm.username}
          onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={registerForm.email}
          onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Create a password (min 6 characters)"
          value={registerForm.password}
          onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
        Create Account
      </Button>
      <div className="text-center">
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-sm text-muted-foreground hover:text-primary underline"
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;