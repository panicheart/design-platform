import { Star, Heart, Zap, Globe, Award, Users } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useTheme } from '@/components/ThemeProvider';

const values = [
  {
    icon: Star,
    title: '科学严谨',
    description: '以麦克斯韦方程为理论基础，追求精确与完美',
  },
  {
    icon: Heart,
    title: '充满热情',
    description: '对微波技术的热爱是推动创新的源动力',
  },
  {
    icon: Zap,
    title: '勇于创新',
    description: '不断探索电磁波应用的新边界',
  },
  {
    icon: Globe,
    title: '服务航天',
    description: '以微波技术助力国家航天事业发展',
  },
  {
    icon: Award,
    title: '质量至上',
    description: '每一个组件都经过严格测试与验证',
  },
  {
    icon: Users,
    title: '协同攻关',
    description: '团队协作攻克技术难关',
  },
];

export default function Culture() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="culture"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`relative py-32 lg:py-40 overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-slate-950' : 'bg-gradient-to-b from-white via-indigo-50/20 to-slate-50'
      }`}
    >
      {!isDark && (
        <>
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-gradient-to-l from-blue-100/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-gradient-to-r from-cyan-100/15 to-transparent rounded-full blur-3xl" />
        </>
      )}

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
              部门文化
            </span>
            <div className={`w-12 h-[1px] ${isDark ? 'bg-slate-700' : 'bg-blue-200'}`} />
          </div>

          <h2
            className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${isDark ? 'text-white' : 'text-slate-900'}`}
            style={{ transitionDelay: '100ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            我们的
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              价值观
            </span>
          </h2>

          <p
            className={`mt-6 max-w-2xl mx-auto text-lg transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
            style={{ transitionDelay: '200ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            微波室的文化建立在电磁波理论之上——严谨、精确、充满能量
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={`group relative p-8 rounded-3xl transition-all duration-500 hover:scale-[1.02] ${
                isDark
                  ? 'bg-slate-900/50 border border-slate-800 hover:border-slate-700 shadow-sm hover:shadow-xl'
                  : 'bg-white/80 backdrop-blur-sm border border-slate-200/60 hover:border-blue-200/60 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(59,130,246,0.1)]'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
              style={{
                transitionDelay: `${300 + index * 100}ms`,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 transition-all duration-300 ${
                isDark
                  ? 'bg-blue-500/10 group-hover:bg-blue-500/20'
                  : 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 group-hover:from-blue-100/80 group-hover:to-indigo-100/80 border border-blue-100/60 shadow-sm'
              }`}
              >
                <value.icon className={`w-7 h-7 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`} />
              </div>

              <h3 className={`font-display font-bold text-xl mb-3 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {value.title}
              </h3>

              <p className={`leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
