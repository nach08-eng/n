import { motion } from "framer-motion";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { useTasks } from "@/hooks/use-tasks";
import { 
  CheckCircle2, 
  Circle, 
  Trophy, 
  Target, 
  Calendar as CalendarIcon,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, toggleTask } = useTasks();

  const today = format(new Date(), "yyyy-MM-dd");
  const todayTasks = tasks.filter(t => t.date === today);
  const completedToday = todayTasks.filter(t => t.completed).length;
  const totalToday = todayTasks.length;
  
  const progressPercent = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
            Welcome back, {user?.name?.split(' ')[0] || 'Student'}
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Here's what's happening with your studies today.
          </p>
        </div>
        <div className="text-sm font-medium text-muted-foreground flex items-center gap-2 bg-secondary px-4 py-2 rounded-lg w-fit">
          <CalendarIcon className="w-4 h-4" />
          {format(new Date(), "EEEE, MMMM do")}
        </div>
      </motion.div>

      {/* Metrics Row */}
      <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-16 h-16 text-primary" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-1">Today's Progress</p>
            <h3 className="text-4xl font-display font-bold text-foreground">{progressPercent}%</h3>
          </div>
          <div className="mt-6 w-full bg-secondary rounded-full h-2 overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-1">Tasks Completed</p>
            <h3 className="text-3xl font-display font-bold text-foreground">{completedToday}</h3>
          </div>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center text-accent-foreground">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground mb-1">Total Tasks</p>
            <h3 className="text-3xl font-display font-bold text-foreground">{totalToday}</h3>
          </div>
        </div>
      </motion.div>

      {/* Today's Tasks */}
      <motion.div variants={item} className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border/50 flex items-center justify-between">
          <h2 className="text-xl font-display font-bold text-foreground">Today's Focus</h2>
          <Link href="/planner" className="text-sm font-semibold text-primary hover:underline flex items-center gap-1">
            Open Planner <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="p-2 md:p-6 flex-1">
          {todayTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-muted-foreground mb-4">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">No tasks for today</h3>
              <p className="text-muted-foreground max-w-xs mb-6">Take a break or generate a new AI study plan to stay sharp.</p>
              <Link href="/planner" className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                Create a Plan
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div 
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer group",
                    task.completed 
                      ? "bg-secondary/50 border-transparent" 
                      : "bg-background border-border/50 hover:border-primary/30 hover:shadow-md"
                  )}
                >
                  <button className="text-muted-foreground hover:text-primary transition-colors focus:outline-none">
                    {task.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-primary" />
                    ) : (
                      <Circle className="w-6 h-6 group-hover:text-primary" />
                    )}
                  </button>
                  <span className={cn(
                    "flex-1 text-base font-medium transition-all",
                    task.completed ? "text-muted-foreground line-through" : "text-foreground"
                  )}>
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
