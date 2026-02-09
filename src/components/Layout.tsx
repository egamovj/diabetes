import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, LineChart, Activity, Calculator, User, Menu, X, LogOut, ChevronRight, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    signOut(auth);
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Glucose', path: '/glucose', icon: <LineChart size={20} /> },
    { name: 'Symptoms', path: '/symptoms', icon: <Activity size={20} /> },
    { name: 'Calculator', path: '/calculator', icon: <Calculator size={20} /> },
    { name: 'Wellness', path: '/wellness', icon: <User size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#fafcfb] font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex w-72 flex-col fixed inset-y-0 z-50 bg-white border-r border-emerald-50/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 pb-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg shadow-emerald-200 transition-transform group-hover:scale-110">
              <Activity size={24} />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 font-outfit uppercase">
              Diabetes<span className="text-emerald-600">Care</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <div className="px-4 mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Main Menu</p>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "group flex items-center justify-between gap-3 px-4 py-3 rounded-2xl transition-all duration-300 font-bold text-sm",
                location.pathname === item.path
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200/50 translate-x-1"
                  : "text-slate-500 hover:bg-emerald-50/50 hover:text-emerald-900"
              )}
            >
              <div className="flex items-center gap-3">
                <span className={cn(
                  "transition-colors",
                  location.pathname === item.path ? "text-white" : "group-hover:text-emerald-600"
                )}>{item.icon}</span>
                {item.name}
              </div>
              {location.pathname === item.path && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          ))}

          <div className="px-4 mt-8 mb-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Settings</p>
          </div>
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-500 hover:bg-emerald-50/50 hover:text-emerald-900 transition-all font-bold text-sm group"
          >
            <Settings size={20} className="group-hover:text-emerald-600 transition-colors" />
            Account Settings
          </button>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 h-12 rounded-2xl text-red-500 hover:text-red-600 hover:bg-red-50 font-bold transition-all group"
          >
            <LogOut size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-72 min-h-screen relative">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-100/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-100/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        {/* Mobile Header */}
        <header className="sticky top-0 z-40 md:hidden bg-white/80 backdrop-blur-xl border-b border-emerald-50/50 transition-all">
          <div className="flex items-center justify-between h-16 px-6">
            <Link to="/" className="flex items-center gap-2">
              <Activity className="text-emerald-600" size={24} />
              <span className="font-black text-slate-900 font-outfit uppercase tracking-tighter">DC <span className="text-emerald-600">Care</span></span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} className="text-slate-900" /> : <Menu size={24} className="text-slate-600" />}
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden pt-6 pb-24 md:pt-10 md:pb-10">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Mobile Navigation Bar */}
        <nav className="fixed bottom-6 inset-x-6 h-16 bg-white/90 backdrop-blur-2xl border border-emerald-100/50 shadow-2xl shadow-emerald-200/20 rounded-[28px] md:hidden z-50 flex items-center justify-around px-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-2xl transition-all duration-300",
                location.pathname === item.path
                  ? "text-emerald-600 bg-emerald-50/80"
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className={cn(
                "transition-transform duration-300",
                location.pathname === item.path ? "scale-110 -translate-y-0.5" : "scale-100"
              )}>
                {item.icon}
              </div>
              {location.pathname === item.path && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 h-1 w-1 rounded-full bg-emerald-600"
                />
              )}
            </Link>
          ))}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-red-400 hover:text-red-500 hover:bg-red-50 rounded-2xl"
          >
            <LogOut size={20} />
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
