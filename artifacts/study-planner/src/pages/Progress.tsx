import { motion } from "framer-motion";
import { useTasks } from "@/hooks/use-tasks";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Trophy, TrendingUp, Target, ListTodo } from "lucide-react";

export default function Progress() {
  const { tasks } = useTasks();

  // Aggregate stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  // Generate last 7 days chart data
  const today = new Date();
  const last7Days = eachDayOfInterval({
    start: subDays(today, 6),
    end: today,
  });

  const chartData = last7Days.map(day => {
    const dateStr = format(day, "yyyy-MM-dd");
    const dayTasks = tasks.filter(t => t.date === dateStr);
    return {
      name: format(day, "EEE"),
      fullDate: format(day, "MMM d"),
      completed: dayTasks.filter(t => t.completed).length,
      total: dayTasks.length
    };
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border shadow-xl p-3 rounded-lg">
          <p className="font-semibold text-foreground mb-1">{payload[0].payload.fullDate}</p>
          <p className="text-sm text-primary">Completed: {payload[0].value}</p>
          <p className="text-sm text-muted-foreground">Total: {payload[0].payload.total}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-5xl mx-auto pb-12"
    >
      <div>
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">Progress & Stats</h1>
        <p className="text-muted-foreground text-lg mt-1">Track your study momentum over time.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <Trophy className="w-5 h-5 text-accent" />
            <h3 className="font-semibold text-sm">Completion Rate</h3>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{progressPercent}%</p>
        </div>
        
        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <ListTodo className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-sm">Total Tasks</h3>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{totalTasks}</p>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <Target className="w-5 h-5 text-emerald-500" />
            <h3 className="font-semibold text-sm">Completed</h3>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{completedTasks}</p>
        </div>

        <div className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-muted-foreground">
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <h3 className="font-semibold text-sm">Pending</h3>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{totalTasks - completedTasks}</p>
        </div>
      </div>

      <div className="bg-card border border-border/60 rounded-2xl shadow-sm p-6">
        <h2 className="text-xl font-display font-bold text-foreground mb-6">Last 7 Days Activity</h2>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--secondary))' }} />
              <Bar dataKey="completed" radius={[6, 6, 6, 6]} maxBarSize={50}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.completed === entry.total && entry.total > 0 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.6)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
