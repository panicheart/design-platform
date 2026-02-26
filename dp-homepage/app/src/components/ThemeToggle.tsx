import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';

interface ThemeToggleProps {
  variant?: 'ghost' | 'outline' | 'default';
  size?: 'sm' | 'default' | 'icon';
  className?: string;
  isScrolled?: boolean;
}

export function ThemeToggle({
  variant = 'ghost',
  size = 'icon',
  className = '',
  isScrolled = false
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`rounded-full transition-all duration-300 ${className} ${
        isScrolled
          ? theme === 'dark'
            ? 'text-white hover:bg-white/10'
            : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
          : 'text-white/80 hover:text-white hover:bg-white/10'
      }`}
      title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
    >
      {theme === 'light' ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </Button>
  );
}
