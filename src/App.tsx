import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./pages/Home";
const queryClient = new QueryClient();
function NotFound() { return <div className="min-h-screen bg-black flex items-center justify-center"><div className="text-center"><h1 className="font-serif text-6xl text-white mb-4">404</h1><p className="text-white/40 font-light">Page not found.</p></div></div>; }
function Router() { return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>; }
export default function App() { return <QueryClientProvider client={queryClient}><WouterRouter><Router /></WouterRouter></QueryClientProvider>; }
