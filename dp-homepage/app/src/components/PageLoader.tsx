import { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';

export default function PageLoader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 transition-opacity duration-500 ${
        progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse" />
        <div className="relative p-4 rounded-2xl bg-slate-900/50 border border-slate-800">
          <Radio className="w-12 h-12 text-blue-500 animate-pulse" />
        </div>
      </div>

      <div className="mt-8 w-48 h-1 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      <p className="mt-4 text-slate-400 text-sm font-medium tracking-wider">
        加载中...
      </p>
    </div>
  );
}
