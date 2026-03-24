import { motion } from "framer-motion";
import { useTasks } from "@/hooks/use-tasks";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday,
  parseISO
} from "date-fns";
import { cn } from "@/lib/utils";

export default function Calendar() {
  const { tasks } = useTasks();
  const currentDate = new Date();
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
  
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl mx-auto pb-12"
    >
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Calendar</h1>
          <p className="text-muted-foreground text-lg mt-1">
            {format(currentDate, "MMMM yyyy")}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-2xl shadow-sm overflow-hidden">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-border/50 bg-secondary/30">
          {weekDays.map(day => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {/* Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-border/20 gap-[1px]">
          {calendarDays.map((day, i) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const dayTasks = tasks.filter(t => t.date === dateStr);
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isCurrentDay = isToday(day);

            return (
              <div 
                key={day.toString()} 
                className={cn(
                  "min-h-[100px] md:min-h-[120px] bg-card p-2 flex flex-col transition-colors",
                  !isCurrentMonth && "bg-secondary/40 text-muted-foreground/50",
                  isCurrentDay && "bg-primary/5"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={cn(
                    "w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold",
                    isCurrentDay ? "bg-primary text-primary-foreground" : (isCurrentMonth ? "text-foreground" : "text-muted-foreground")
                  )}>
                    {format(day, "d")}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                      {dayTasks.length} tasks
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col gap-1 overflow-y-auto mt-1 custom-scrollbar pr-1">
                  {dayTasks.slice(0, 3).map(task => (
                    <div 
                      key={task.id} 
                      className={cn(
                        "text-[10px] md:text-xs truncate px-1.5 py-1 rounded",
                        task.completed 
                          ? "bg-secondary text-muted-foreground line-through" 
                          : "bg-primary/10 text-primary font-medium"
                      )}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 3 && (
                    <div className="text-[10px] text-muted-foreground font-medium pl-1">
                      +{dayTasks.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
