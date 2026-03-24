import { ReactNode, useState } from "react";
import { Link, useRoute } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CalendarDays, 
  ListTodo, 
  TrendingUp, 
  Moon, 
  Sun, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from "lucide-react";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

function NavItem({ href, icon: Icon, label, onClick }: NavItemProps) {
  const [isActive] = useRoute(href);

  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
        isActive 
          ? "bg-primary text-primary-foreground font-medium shadow-md shadow-primary/10" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <Icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
      <span>{label}</span>
    </Link>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const { isDark, toggle } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMenu = () => setIsMobileMenuOpen(false);

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 px-4 py-6 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg shadow-primary/20 text-primary-foreground">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl leading-none">StudyAI</h1>
          <p className="text-xs text-muted-foreground font-medium">Smart Planner</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2 px-2">
        <NavItem href="/" icon={LayoutDashboard} label="Dashboard" onClick={closeMenu} />
        <NavItem href="/planner" icon={ListTodo} label="Planner" onClick={closeMenu} />
        <NavItem href="/calendar" icon={CalendarDays} label="Calendar" onClick={closeMenu} />
        <NavItem href="/progress" icon={TrendingUp} label="Progress" onClick={closeMenu} />
      </nav>

      <div className="p-4 mt-auto border-t border-border/50 space-y-4">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-bold text-foreground">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.name || "User"}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={toggle}
            className="flex-1 flex justify-center items-center py-2.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
            title="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            onClick={logout}
            className="flex-1 flex justify-center items-center py-2.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex w-full selection:bg-primary/20 selection:text-primary">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border/40 fixed inset-y-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 inset-x-0 h-16 bg-card/80 backdrop-blur-md border-b border-border/40 z-30 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="font-display font-bold text-lg">StudyAI</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -mr-2 text-foreground hover:bg-secondary rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="md:hidden fixed inset-y-0 left-0 w-3/4 max-w-sm bg-card shadow-2xl z-50 flex flex-col"
            >
              <div className="absolute top-4 right-4">
                <button 
                  onClick={closeMenu}
                  className="p-2 text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0">
        <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-[calc(100vh-4rem)] md:min-h-screen flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
