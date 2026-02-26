import { ArrowRight, Radio, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useTheme } from '@/components/ThemeProvider';

const features = [
  {
    icon: Radio,
    title: '射频 expertise',
    description: '覆盖1-40GHz全频段微波技术',
  },
  {
    icon: Zap,
    title: '高功率技术',
    description: '千瓦级微波功率放大与传输',
  },
  {
    icon: Target,
    title: '精密测量',
    description: '微波参数精确测试与校准',
  },
];

const stats = [
  { value: '30+', label: '年经验' },
  { value: '200+', label: '研发人员' },
  { value: '98%', label: '成功率' },
];

export default function About() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <section
      id="about"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`relative py-32 lg:py-40 overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-slate-950' : 'bg-gradient-to-b from-white via-slate-50/50 to-white'
      }`}
    >
      {!isDark && (
        <>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-100/30 via-indigo-50/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-cyan-100/20 via-sky-50/10 to-transparent rounded-full blur-3xl" />
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
              关于我们
            </span>
            <div className={`w-12 h-[1px] ${isDark ? 'bg-slate-700' : 'bg-blue-200'}`} />
          </div>

          <h2
            className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${isDark ? 'text-white' : 'text-slate-900'}`}
            style={{ transitionDelay: '100ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            以理论为基石
            <br />
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              开拓技术新境界
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">
          <div
            className={`lg:col-span-7 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
            }`}
            style={{ transitionDelay: '200ms', transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
          >
            <div className={`relative overflow-hidden rounded-3xl group transition-all duration-500 ${
              isDark 
                ? 'bg-slate-900/50 shadow-sm hover:shadow-xl' 
                : 'bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]'
            }`}>
              <div className={`absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative p-8 lg:p-12">
                <p className={`text-lg lg:text-xl leading-relaxed mb-8 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  微波室隶属于航天科工集团，是国内领先的微波技术研发中心。
                  我们深耕微波领域三十余年，在雷达系统、通信设备、微波组件等方面积累了深厚的技术底蕴。
                </p>
                
                <p className={`text-lg lg:text-xl leading-relaxed mb-10 ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>
                  为国家航天事业和国防建设提供了大量关键技术与产品，
                  以麦克斯韦方程组为理论基础，追求精确与完美。
                </p>

                <Button
                  variant="outline"
                  size="lg"
                  className={`group relative rounded-full px-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                    isDark
                      ? 'border-slate-700 text-slate-200 hover:bg-slate-800 hover:border-slate-600'
                      : 'border-blue-200 text-blue-700 hover:bg-blue-50/50 hover:border-blue-300 bg-white/50'
                  }`}
                >
                  了解更多
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`group relative p-6 rounded-2xl transition-all duration-500 hover:scale-[1.02] ${
                  isDark
                    ? 'bg-slate-900/50 border border-slate-800 hover:border-slate-700 shadow-sm hover:shadow-lg'
                    : 'bg-white/70 backdrop-blur-sm border border-slate-200/60 hover:border-blue-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(59,130,246,0.08)]'
                } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ 
                  transitionDelay: `${300 + index * 100}ms`,
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className={`relative p-3 rounded-xl ${
                    isDark
                      ? 'bg-blue-500/10 group-hover:bg-blue-500/20'
                      : 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 group-hover:from-blue-100/80 group-hover:to-indigo-100/80 border border-blue-100/60 shadow-sm'
                  } transition-all duration-300`}
                  >
                    <feature.icon className={`w-6 h-6 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className={`font-display font-bold text-lg mb-1 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div
              className={`relative overflow-hidden rounded-2xl transition-all duration-700 ${
                isDark
                  ? 'bg-gradient-to-br from-blue-600/20 to-cyan-600/20 border border-blue-500/20 shadow-sm'
                  : 'bg-gradient-to-br from-white/90 via-blue-50/40 to-indigo-50/30 border border-blue-200/50 shadow-[0_2px_12px_rgba(59,130,246,0.06)]'
              } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ 
                transitionDelay: '600ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  {stats.map((stat, index) => (
                    <div key={stat.label} className={`text-center ${index > 0 ? `pl-6 border-l ${isDark ? 'border-slate-700' : 'border-blue-100'}` : ''}`}>
                      <div className={`text-3xl font-display font-bold ${
                        isDark ? 'text-white' : 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600'
                      }`}>
                        {stat.value}
                      </div>
                      <div className={`text-xs mt-1 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
