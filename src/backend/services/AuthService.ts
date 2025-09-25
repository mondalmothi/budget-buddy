import { User, LoginForm, RegisterForm } from '../../frontend/types';
import { DataStore } from '../data/DataStore';

export class AuthService {
  private dataStore = DataStore.getInstance();

  validateLogin(loginData: LoginForm): { success: boolean; user?: User; error?: string } {
    if (!loginData.email || !loginData.password) {
      return { success: false, error: "Please enter both email and password" };
    }

    const users = this.dataStore.getUsers();
    const user = users.find(u => u.email === loginData.email && u.password === loginData.password);
    
    if (user) {
      return { success: true, user };
    } else {
      return { success: false, error: "Invalid email or password. Please check your credentials." };
    }
  }

  validateRegistration(registerData: RegisterForm): { success: boolean; user?: User; error?: string } {
    if (!registerData.username || !registerData.email || !registerData.password) {
      return { success: false, error: "Please fill in all fields" };
    }

    if (registerData.password.length < 6) {
      return { success: false, error: "Password must be at least 6 characters long" };
    }

    const users = this.dataStore.getUsers();
    if (users.some(u => u.email === registerData.email)) {
      return { success: false, error: "An account with this email already exists" };
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: registerData.username.trim(),
      email: registerData.email.toLowerCase().trim(),
      password: registerData.password,
    };

    this.dataStore.addUser(newUser);
    return { success: true, user: newUser };
  }
}