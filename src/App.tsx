      import { Toaster } from "@/components/ui/toaster";
      import { Toaster as Sonner } from "@/components/ui/sonner";
      import { TooltipProvider } from "@/components/ui/tooltip";
      import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
      import { BrowserRouter, Routes, Route } from "react-router-dom";
      import Index from "./pages/Index";
      import PokemonDetail from "./pages/PokemonDetail";
      import TypeList from "./pages/TypeList";
      import TypeDetail from "./pages/TypeDetail";
      import NotFound from "./pages/NotFound";
      import { Footer } from "./components/ui/footer";

      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
          },
        },
      });

      const App = () => (
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/pokemon/:id" element={<PokemonDetail />} />
                <Route path="/types" element={<TypeList />} />
                <Route path="/types/:id" element={<TypeDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      );

      export default App;
