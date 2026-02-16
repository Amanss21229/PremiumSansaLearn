import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navigation from "@/components/Navigation";
import Home from "@/pages/Home";
import Study360 from "@/pages/Study360";
import ModelViewer from "@/pages/ModelViewer";
import NotFound from "@/pages/not-found";

// Wrapper to conditionally render Navigation
function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main>{children}</main>
    </>
  );
}

function Router() {
  return (
    <Switch>
      {/* Routes with Navigation */}
      <Route path="/">
        <PageLayout>
          <Home />
        </PageLayout>
      </Route>
      
      <Route path="/study-360">
        <PageLayout>
          <Study360 />
        </PageLayout>
      </Route>

      {/* Fullscreen Routes (No Navigation) */}
      <Route path="/model/:id" component={ModelViewer} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
