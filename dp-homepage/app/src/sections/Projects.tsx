import { useState } from 'react';
import { ArrowUpRight, Waves } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useTheme } from '@/components/ThemeProvider';

const projects = [
  {
    id: 1,
    title: '相控阵雷达系统',
    category: '雷达技术',
    image: '/project-phasedarray.jpg',
    description: '高分辨率电子扫描相控阵雷达',
    frequency: 'X波段',
    featured: true,
  },
  {
    id: 2,
    title: '卫星通信地面站',
    category: '通信系统',
    image: '/project-groundstation.jpg',
    description: '大口径抛物面天线地面接收系统',
    frequency: 'C/Ku波段',
  },
  {
    id: 3,
    title: '微波功率放大器',
    category: '微波组件',
    image: '/project-amplifier.jpg',
    description: '高功率固态微波放大模块',
    frequency: 'S/C波段',
  },
  {
    id: 4,
    title: '电磁兼容测试系统',
    category: '测试设备',
    image: '/project-emc.jpg',
    description: '全频段EMC测试与认证平台',
    frequency: '1-18GHz',
  },
  {
    id: 5,
    title: '毫米波雷达传感器',
    category: '传感器',
    image: '/project-mmwave.jpg',
    description: '77GHz车载毫米波雷达模块',
    frequency: '77GHz',
  },
  {
    id: 6,
    title: '天线测试场',
    category: '测试设施',
    image: '/project-antennatest.jpg',
    description: '室外远场天线测试与校准',
    frequency: '全频段',
  },
];

export default function Projects() {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const featuredProject = projects.find(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section
      id="projects"
      ref={sectionRef as React.RefObject<HTMLElement>}
      className={`relative py-32 lg:py-40 overflow-hidden transition-colors duration-500 ${
        isDark ? 'bg-slate-950' : 'bg-gradient-to-b from-white via-slate-50/30 to-white'
      }`}
    >
      {!isDark && (
        <>
          <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-gradient-to-bl from-indigo-100/20 via-blue-50/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-100/15 via-sky-50/10 to-transparent rounded-full blur-3xl" />
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16">
          <div>
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
                产品展示
              </span>
            </div>

            <h2
              className={`font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              } ${isDark ? 'text-white' : 'text-slate-900'}`}
              style={{ transitionDelay: '100ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              探索我们的
              <span className="bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
                产品
              </span>
            </h2>
          </div>

          <p
            className={`mt-6 lg:mt-0 max-w-md text-lg transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            } ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
            style={{ transitionDelay: '200ms', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
          >
            从雷达系统到微波组件，我们的产品覆盖微波技术的各个领域
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredProject && (
            <div
              className={`lg:col-span-2 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: '300ms' }}
              onMouseEnter={() => setHoveredId(featuredProject.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={`group relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 ${
                isDark 
                  ? 'bg-slate-900/50 border border-slate-800 hover:border-slate-700 shadow-sm hover:shadow-xl' 
                  : 'bg-white/90 backdrop-blur-sm border border-slate-200/70 hover:border-blue-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]'
              }`}>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="relative h-[300px] lg:h-[400px] overflow-hidden">
                    <img
                      src={featuredProject.image}
                      alt={featuredProject.title}
                      className={`w-full h-full object-cover transition-transform duration-700 ${
                        hoveredId === featuredProject.id ? 'scale-110' : 'scale-100'
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                    
                    <div className={`absolute top-6 left-6 backdrop-blur-md px-4 py-2 rounded-full border ${
                      isDark 
                        ? 'bg-slate-900/80 border-slate-700 text-slate-300' 
                        : 'bg-white/80 border-slate-200 text-slate-600'
                    }`}>
                      <span className="text-sm font-medium flex items-center gap-2">
                        <Waves className="w-4 h-4" />
                        {featuredProject.frequency}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <span className={`text-sm font-medium tracking-widest uppercase mb-3 ${
                      isDark ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {featuredProject.category}
                    </span>
                    
                    <h3 className={`font-display text-3xl lg:text-4xl font-bold mb-4 ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {featuredProject.title}
                    </h3>
                    
                    <p className={`text-lg mb-6 ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {featuredProject.description}
                    </p>
                    
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      hoveredId === featuredProject.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : isDark ? 'bg-slate-800 text-slate-400' : 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600 border border-blue-100'
                    }`}>
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {otherProjects.map((project, index) => (
            <div
              key={project.id}
              className={`transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${400 + index * 100}ms` }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className={`group relative overflow-hidden rounded-3xl cursor-pointer h-full transition-all duration-500 ${
                isDark 
                  ? 'bg-slate-900/50 border border-slate-800 hover:border-slate-700 shadow-sm hover:shadow-xl' 
                  : 'bg-white/90 backdrop-blur-sm border border-slate-200/70 hover:border-blue-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.1)]'
              }`}>
                <div className="relative h-[240px] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      hoveredId === project.id ? 'scale-110' : 'scale-100'
                    }`}
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  <div className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    hoveredId === project.id
                      ? 'bg-white text-slate-900'
                      : 'bg-black/30 text-white backdrop-blur-sm'
                  }`}>
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                      isDark 
                        ? 'bg-blue-500/20 text-blue-300' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {project.category}
                    </span>
                    
                    <h3 className="font-display text-xl font-bold text-white mb-1">
                      {project.title}
                    </h3>
                    
                    <p className="text-sm text-white/70">
                      {project.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
