import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "@/hooks/use-tasks";
import { useGeneratePlan } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Bot,
  BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function Planner() {
  const { tasks, addTask, addMultipleTasks, toggleTask, deleteTask } = useTasks();
  const { toast } = useToast();
  
  const [manualTask, setManualTask] = useState("");
  const [goal, setGoal] = useState("");
  
  const generatePlanMutation = useGeneratePlan();

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTask.trim()) return;
    addTask(manualTask.trim());
    setManualTask("");
  };

  const handleGenerateAI = () => {
    const promptGoal = goal.trim() || "Data Analyst";
    
    generatePlanMutation.mutate(
      { data: { goal: promptGoal } },
      {
        onSuccess: (data) => {
          if (data.tasks && data.tasks.length > 0) {
            addMultipleTasks(data.tasks);
            setGoal("");
            toast({
              title: "Plan Generated! ✨",
              description: `Added ${data.tasks.length} tasks for your goal: ${promptGoal}`,
            });
          }
        },
        onError: (err) => {
          toast({
            title: "Generation Failed",
            description: "Could not connect to AI. Please try again.",
            variant: "destructive"
          });
        }
      }
    );
  };

  const today = format(new Date(), "yyyy-MM-dd");
  // Sort tasks: pending first, then by creation date (newest first)
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed === b.completed) {
      return b.createdAt - a.createdAt;
    }
    return a.completed ? 1 : -1;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Study Planner</h1>
        <p className="text-muted-foreground text-lg">Manage your tasks or let AI create a plan for you.</p>
      </div>

      {/* Top Creation Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manual Task Add */}
        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-foreground font-semibold">
            <Plus className="w-5 h-5 text-primary" />
            <h3>Add Task Manually</h3>
          </div>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualTask}
              onChange={(e) => setManualTask(e.target.value)}
              placeholder="e.g. Read chapter 4..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-secondary border border-transparent focus:border-primary focus:bg-background focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!manualTask.trim()}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </form>
        </div>

        {/* AI Generator */}
        <div className="bg-gradient-to-br from-card to-card border border-border/60 rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          <div className="flex items-center gap-2 mb-4 text-foreground font-semibold relative z-10">
            <Sparkles className="w-5 h-5 text-accent" />
            <h3>Generate AI Plan</h3>
          </div>
          <div className="flex gap-2 relative z-10">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Goal: e.g. Data Analyst"
              className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all"
            />
            <button
              onClick={handleGenerateAI}
              disabled={generatePlanMutation.isPending}
              className="px-5 py-2.5 rounded-xl bg-foreground text-background font-semibold hover:bg-foreground/90 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 whitespace-nowrap"
            >
              {generatePlanMutation.isPending ? (
                <>
                  <BrainCircuit className="w-5 h-5 animate-pulse" />
                  Generating...
                </>
              ) : (
                <>
                  <Bot className="w-5 h-5" />
                  Generate 🤖
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-secondary/30">
          <h2 className="text-xl font-display font-bold">All Tasks</h2>
          <span className="bg-background px-3 py-1 rounded-full text-xs font-semibold border border-border shadow-sm">
            {tasks.length} total
          </span>
        </div>
        
        <div className="p-4 md:p-6">
          {sortedTasks.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center">
              <ListTodoIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-lg font-semibold text-foreground">Your planner is empty</p>
              <p className="text-muted-foreground">Add a task above or use AI to generate a plan.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {sortedTasks.map((task) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    key={task.id}
                    className={cn(
                      "group flex items-center justify-between p-4 rounded-xl border transition-all",
                      task.completed 
                        ? "bg-secondary/40 border-transparent" 
                        : "bg-background border-border hover:border-primary/40 shadow-sm"
                    )}
                  >
                    <div className="flex items-center gap-4 flex-1 overflow-hidden">
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors focus:outline-none"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </button>
                      <div className="flex flex-col truncate">
                        <span className={cn(
                          "text-base font-medium truncate transition-all",
                          task.completed ? "text-muted-foreground line-through" : "text-foreground"
                        )}>
                          {task.title}
                        </span>
                        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-0.5">
                          {task.date === today ? "Today" : task.date}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="ml-4 p-2 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all focus:opacity-100 focus:outline-none"
                      title="Delete task"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Just a quick localized icon fallback
function ListTodoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="5" width="6" height="6" rx="1" />
      <path d="m3 17 2 2 4-4" />
      <path d="M13 6h8" />
      <path d="M13 12h8" />
      <path d="M13 18h8" />
    </svg>
  )
}
