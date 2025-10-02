// src/App.tsx

import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppHeader } from '@/components/AppHeader';

function App() {
  // Apply saved theme on load
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.classList.add(savedTheme);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        <AppHeader />
        <main>
          {/* The correct page component will be rendered here by the router */}
          <Outlet />
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;