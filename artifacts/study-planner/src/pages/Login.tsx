import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Sparkles, ArrowRight } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setIsSubmitting(true);
    // Simulate network request
    setTimeout(() => {
      login(email, name);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left panel - Branding/Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden bg-zinc-950 items-center justify-center">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/login-bg.png`} 
            alt="Abstract startup background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        </div>
        <div className="relative z-10 p-12 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 border border-white/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4 leading-tight">
              Master your studies with AI.
            </h1>
            <p className="text-lg text-zinc-300 font-light">
              Plan, track, and execute your goals with intelligent task generation designed for peak productivity.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-12 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-8 shadow-lg shadow-primary/20">
            <Sparkles className="w-6 h-6" />
          </div>
          
          <h2 className="text-3xl font-display font-bold text-foreground mb-2">Welcome back</h2>
          <p className="text-muted-foreground mb-8">Enter your details to access your dashboard.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-semibold text-foreground">Full Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Developer"
                className="w-full px-4 py-3 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-background focus:outline-none transition-all placeholder:text-muted-foreground/50"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-foreground">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-4 py-3 rounded-xl bg-secondary border-2 border-transparent focus:border-primary focus:bg-background focus:outline-none transition-all placeholder:text-muted-foreground/50"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name || !email}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  Continue to App
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-muted-foreground">
            This is a mock login for demonstration purposes. <br/>Any credentials will work.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
