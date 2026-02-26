import { Radio, Waves, Zap, Award } from 'lucide-react';
import { useScrollAnimation, useAnimatedCounter } from '@/hooks/use-scroll-animation';
import { useTheme } from '@/components/ThemeProvider';

const stats = [
  {
    icon: Radio,
    value: 40,
    suffix: 'GHz',
    label: '最高工作频率',
  },
  {
    icon: Waves,
    value: 500,
    suffix: '+',
    label: '微波组件型号',
  },
  {
    icon: Zap,
    value: 10,
    suffix: 'kW',
    label: '峰值输出功率',
  },
  {
    icon: Award,
    value: 100,
    suffix: '+',
    label: '技术专利',
  },
];

function AnimatedCounter({ value, suffix, isVisible, isDark }: { value: number; suffix: string; isVisible: boolean; isDark: boolean }) {
  const count = useAnimatedCounter(value, isVisible);

  return (
    <span className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold ${
      isVisible 
        ? isDark ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600'
        : isDark ? 'text-white/50' : 'text-slate-300'
    }`}>
      {count}{suffix}
    </span>
  );
}

export default function Achievements() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.3 });
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="achievements"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`relative py-32 lg:py-40 overflow-hidden transition-colors duration-500 ${
        isDark 
          ? 'bg-slate-950' 
          : 'bg-gradient-to-b from-white via-blue-50/30 to-indigo-50/20'
      }`}
    >
      {!isDark && (
        <>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-100/30 to-indigo-100/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-cyan-100/20 to-sky-100/10 rounded-full blur-3xl" />
        </>
      )}

      <div className={`absolute inset-0 ${
        isDark 
          ? 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-slate-900'
          : ''
      }`} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-center mb-20">
          <div
            className={`inline-flex items-center gap-2 mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <div className={`w-12 h-[1px] ${isDark ? 'bg-slate-700' : 'bg-blue-200'}`} />
            <span className={`text-sm font-medium tracking-widest uppercase ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}>
              技术实力
            </span>
            <div className={`w-12 h-[1px] ${isDark ? 'bg-slate-700' : 'bg-blue-200'}`} />
          </div>

          <h2
            className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${isDark ? 'text-white' : 'text-slate-900'}`}
            style={{ transitionDelay: '100ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            数字见证
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              实力
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`group relative p-8 rounded-3xl transition-all duration-600 border ${
                isDark
                  ? 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  : 'bg-white/80 backdrop-blur-sm border-slate-200/60 hover:border-blue-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.1)]'
              } ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-80'}`}
              style={{
                transitionDelay: `${index * 150}ms`,
                transitionTimingFunction: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
              }}
            >
              <div className="mb-6">
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${
                  isDark 
                    ? 'bg-blue-500/10' 
                    : 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-100/60 shadow-sm'
                }`}>
                  <stat.icon className={`w-7 h-7 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                </div>
              </div>

              <div className="mb-2">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                  isDark={isDark}
                />
              </div>

              <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
