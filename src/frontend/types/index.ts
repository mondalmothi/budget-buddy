// Frontend Types
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface Expense {
  id: string;
  userId: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
}

export interface ExpenseForm {
  description: string;
  amount: string;
  category: string;
}

export interface ChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}