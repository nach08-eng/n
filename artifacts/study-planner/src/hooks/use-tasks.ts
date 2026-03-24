import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
  createdAt: number;
}

// Generate some initial mock tasks for a rich first-time experience
const generateInitialTasks = (): Task[] => {
  const today = format(new Date(), "yyyy-MM-dd");
  return [
    { id: "1", title: "Review React documentation", completed: true, date: today, createdAt: Date.now() - 10000 },
    { id: "2", title: "Setup Tailwind CSS project", completed: false, date: today, createdAt: Date.now() - 5000 },
    { id: "3", title: "Complete API integration", completed: false, date: today, createdAt: Date.now() },
  ];
};

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("planner-tasks");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return parsed.length > 0 ? parsed : generateInitialTasks();
        } catch {
          return generateInitialTasks();
        }
      }
    }
    return generateInitialTasks();
  });

  // Sync to localstorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("planner-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((title: string, date: string = format(new Date(), "yyyy-MM-dd")) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      date,
      createdAt: Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const addMultipleTasks = useCallback((titles: string[], date: string = format(new Date(), "yyyy-MM-dd")) => {
    const newTasks = titles.map((title) => ({
      id: crypto.randomUUID(),
      title,
      completed: false,
      date,
      createdAt: Date.now() + Math.random() * 1000, // slight offset to maintain order
    }));
    setTasks((prev) => [...newTasks, ...prev]);
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return {
    tasks,
    addTask,
    addMultipleTasks,
    toggleTask,
    deleteTask,
  };
}
