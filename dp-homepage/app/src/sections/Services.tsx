import { useState } from 'react';
import { ArrowRight, Radio, Waves, Cpu, Check } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useTheme } from '@/components/ThemeProvider';

const services = [
  {
    id: 'anechoic',
    icon: Radio,
    title: '微波暗室测试',
    subtitle: '专业电磁兼容与天线测试',
    description: '配备国内领先的微波暗室设施，提供天线方向图测量、雷达散射截面(RCS)测试、电磁兼容性(EMC)测试等专业服务，测试频率覆盖1-40GHz全频段。',
    image: '/service-anechoic.jpg',
    features: ['天线方向图测试', 'RCS测量', 'EMC测试', '近场/远场转换'],
  },
  {
    id: 'radar',
    icon: Waves,
    title: '雷达系统工程',
    subtitle: '先进雷达技术研发',
    description: '专注于相控阵雷达、合成孔径雷达(SAR)、脉冲多普勒雷达等系统的研发与设计，为国防和民用领域提供高性能雷达解决方案。',
    image: '/service-radar.jpg',
    features: ['相控阵雷达', 'SAR成像', '信号处理', '目标识别'],
  },
  {
    id: 'circuit',
    icon: Cpu,
    title: '微波组件设计',
    subtitle: '高频电路与模块开发',
    description: '从事微波功率放大器、低噪声放大器、混频器、滤波器等核心组件的研制，产品广泛应用于航天、通信、雷达等领域。',
    image: '/service-circuit.jpg',
    features: ['功率放大器', '低噪声放大器', '混频器', '滤波器'],
  },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState(0);
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const activeService = services[activeTab];

  return (
    <section
      id="services"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`relative py-32 lg:py-40 overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-slate-950' : 'bg-gradient-to-b from-slate-50 via-white to-sky-50/30'
      }`}
    >
      {!isDark && (
        <>
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-gradient-to-r from-blue-100/20 to-indigo-100/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-l from-cyan-100/20 to-sky-100/10 rounded-full blur-3xl" />
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="text-center mb-16">
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
              核心技术
            </span>
            <div className={`w-12 h-[1px] ${isDark ? 'bg-slate-700' : 'bg-blue-200'}`} />
          </div>

          <h2
            className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${isDark ? 'text-white' : 'text-slate-900'}`}
            style={{ transitionDelay: '100ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            我们的技术
            <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              领域
            </span>
          </h2>
        </div>

        <div className={`flex flex-wrap justify-center gap-2 mb-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '200ms' }}
        >
          {services.map((service, index) => (
            <button
              key={service.id}
              onClick={() => setActiveTab(index)}
              className={`group relative px-6 py-3 rounded-full font-medium text-sm transition-all duration-300 ${
                activeTab === index
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25'
                  : isDark
                    ? 'bg-slate-900/50 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                    : 'bg-white text-slate-600 hover:text-blue-700 border border-slate-200 hover:border-blue-200 hover:shadow-md'
              }`}
            >
              <span className="flex items-center gap-2">
                <service.icon className="w-4 h-4" />
                {service.title}
              </span>
            </button>
          ))}
        </div>

        <div 
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '300ms' }}
        >
          <div className="relative group">
            <div className={`absolute -inset-4 rounded-3xl blur-2xl transition-opacity duration-500 ${
              isDark ? 'bg-blue-500/10' : 'bg-blue-500/5'
            }`} />
            
            <div className={`relative overflow-hidden rounded-3xl border ${
              isDark 
                ? 'bg-slate-900/50 border-slate-800 shadow-lg' 
                : 'bg-white border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.06)]'
            }`}>
              <img
                src={activeService.image}
                alt={activeService.title}
                className="w-full h-[350px] lg:h-[450px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              
              <div className={`absolute top-4 right-4 backdrop-blur-md px-4 py-2 rounded-full border ${
                isDark 
                  ? 'bg-slate-900/80 border-slate-700 text-slate-300' 
                  : 'bg-white/80 border-slate-200 text-slate-600'
              }`}>
                <span className="text-xs font-mono">
                  {activeTab === 0 && '∇ × E = -∂B/∂t'}
                  {activeTab === 1 && 'Pᵣ ∝ 1/R⁴'}
                  {activeTab === 2 && 'S = |E|²/2η'}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <p className={`text-sm font-medium tracking-widest uppercase mb-3 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {activeService.subtitle}
              </p>              
              <h3 className={`font-display text-3xl lg:text-4xl font-bold mb-6 ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {activeService.title}
              </h3>
              
              <p className={`text-lg leading-relaxed ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {activeService.description}
              </p>
            </div>

            <div className="space-y-3">
              {activeService.features.map((feature, index) => (
                <div
                  key={feature}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${
                    isDark
                      ? 'bg-slate-900/30 border-slate-800 hover:border-slate-700'
                      : 'bg-white/80 backdrop-blur-sm border-slate-200/70 hover:border-blue-200/70 hover:shadow-[0_4px_12px_rgba(59,130,246,0.06)]'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-blue-500/20' : 'bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border border-blue-100/60 shadow-sm'
                  }`}>
                    <Check className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <span className={`font-medium ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            <button className={`group inline-flex items-center gap-2 font-semibold transition-all duration-300 hover:gap-3 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`}>
              了解更多
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
