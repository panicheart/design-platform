import { useState, useEffect } from 'react';
import { Menu, X, Radio, LogIn, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/components/ThemeProvider';

const navLinks = [
  { name: '关于', href: '#about' },
  { name: '技术', href: '#services' },
  { name: '产品', href: '#projects' },
  { name: '荣誉', href: '#achievements' },
  { name: '文化', href: '#culture' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setIsLoaded(true);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);

      const sections = navLinks.map(link => link.href.replace('#', ''));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isScrolled
          ? isDark
            ? 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50'
            : 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-12 h-16">
        <div className="flex items-center justify-between h-full">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollToSection('#home'); }}
            className={`flex items-center gap-3 transition-all duration-600 hover:opacity-80 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-80'
            }`}
          >
            <div className={`relative p-2 rounded-xl transition-all duration-300 ${
              isScrolled
                ? isDark
                  ? 'bg-blue-500/20'
                  : 'bg-blue-50'
                : isDark
                  ? 'bg-white/10'
                  : 'bg-slate-900/10'
            }`}>
              <Radio className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className={`font-display text-lg font-bold transition-colors duration-300 ${
                isScrolled
                  ? isDark
                    ? 'text-white'
                    : 'text-slate-900'
                  : isDark
                    ? 'text-white'
                    : 'text-slate-900'
              }`}>
                微波室
              </span>
              <span className={`text-[10px] tracking-wider uppercase transition-colors duration-300 ${
                isScrolled
                  ? isDark
                    ? 'text-slate-400'
                    : 'text-slate-500'
                  : isDark
                    ? 'text-white/60'
                    : 'text-slate-600'
              }`}>
                航天科工集团
              </span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
                    isActive
                      ? isDark
                        ? 'text-blue-400 bg-blue-500/20'
                        : 'text-blue-600 bg-blue-50'
                      : isScrolled
                        ? isDark
                          ? 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                        : isDark
                          ? 'text-white/80 hover:text-white hover:bg-white/10'
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-900/5'
                  } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}
                  style={{
                    transitionDelay: `${100 + index * 80}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  {link.name}
                  {isActive && (
                    <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${
                      isDark ? 'bg-blue-400' : 'bg-blue-500'
                    }`} />
                  )}
                </a>
              );
            })}
          </div>

          <div
            className={`hidden md:flex items-center gap-3 transition-all duration-500 ${
              isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
            style={{
              transitionDelay: '500ms',
              transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
            }}
          >
            <ThemeToggle isScrolled={isScrolled} />

            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full px-4 text-sm font-medium transition-all duration-300 ${
                isScrolled
                  ? isDark
                    ? 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  : isDark
                    ? 'text-white/80 hover:text-white hover:bg-white/10'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-900/5'
              }`}
              onClick={() => alert('工作台功能即将上线')}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              工作台
            </Button>

            <Button
              size="sm"
              className="rounded-full px-5 text-sm font-medium transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 bg-blue-600 hover:bg-blue-500 text-white"
              onClick={() => alert('登录功能即将上线')}
            >
              <LogIn className="w-4 h-4 mr-2" />
              登录
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle isScrolled={isScrolled} />
            <button
              className={`p-2 rounded-lg transition-colors duration-300 ${
                isScrolled
                  ? isDark
                    ? 'hover:bg-slate-800/50 text-slate-300'
                    : 'hover:bg-slate-100/50 text-slate-700'
                  : isDark
                    ? 'hover:bg-white/10 text-white'
                    : 'hover:bg-slate-900/5 text-slate-900'
              }`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`md:hidden absolute top-full left-4 right-4 mt-2 rounded-2xl transition-all duration-500 overflow-hidden ${
          isDark
            ? 'bg-slate-900/95 backdrop-blur-xl border border-slate-800/50'
            : 'bg-white/95 backdrop-blur-xl border border-slate-200/50'
        } ${isMobileMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        <div className="p-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
              className={`block px-4 py-3 font-medium text-sm rounded-xl transition-all duration-300 ${
                isDark
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              {link.name}
            </a>
          ))}
          <div className={`pt-3 mt-3 border-t space-y-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <Button
              variant="outline"
              size="sm"
              className={`w-full justify-center text-sm rounded-xl ${isDark ? 'border-slate-700 bg-slate-800/50 text-slate-200' : 'border-slate-200 bg-slate-50 text-slate-700'}`}
              onClick={() => alert('工作台功能即将上线')}
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              工作台
            </Button>
            <Button
              size="sm"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-xl"
              onClick={() => alert('登录功能即将上线')}
            >
              <LogIn className="w-4 h-4 mr-2" />
              登录
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
