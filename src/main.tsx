// src/main.tsx

import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import App from "./App.tsx";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import RecentExpenses from "./pages/RecentExpenses";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import "./index.css";

const queryClient = new QueryClient();

// The router is defined here, with App as the main layout component
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true, // This makes Dashboard the default page for "/"
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "transactions",
        element: (
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        ),
      },
      {
        path: "recent-expenses",
        element: (
          <ProtectedRoute>
            <RecentExpenses />
          </ProtectedRoute>
        ),
      },
      {
        path: "auth",
        element: <Auth />,
      },
    ],
  },
]);

// Render the app with all providers wrapping the RouterProvider
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);