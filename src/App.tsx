
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import StudyPage from "./pages/StudyPage";
import ProjectsPage from "./pages/ProjectsPage";
import ExpensesPage from "./pages/ExpensesPage";
import MealsPage from "./pages/MealsPage";
import TasksPage from "./pages/TasksPage";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/meals" element={<MealsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
