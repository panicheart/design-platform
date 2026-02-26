import { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ThemeProvider';

const FloatingParticle = ({ delay, duration, color }: { delay: number; duration: number; color: string }) => (
  <div
    className={`absolute w-1 h-1 rounded-full ${color} opacity-60`}
    style={{
      animation: `float-particle ${duration}s ease-in-out ${delay}s infinite`,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }}
  />
);

const ParticleField = ({ isDark }: { isDark: boolean }) => {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4,
    color: isDark 
      ? ['bg-blue-400', 'bg-cyan-400', 'bg-indigo-400'][Math.floor(Math.random() * 3)]
      : ['bg-blue-500', 'bg-cyan-500', 'bg-indigo-500'][Math.floor(Math.random() * 3)]
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <FloatingParticle key={p.id} {...p} />
      ))}
    </div>
  );
};

const carouselData = [
  {
    image: '/hero-microwave.jpg',
    formula: {
      title: '麦克斯韦方程组',
      content: '∇ × E = -∂B/∂t',
      description: '电磁感应定律',
    },
  },
  {
    image: '/hero-1.jpg',
    formula: {
      title: '欧拉公式',
      content: 'e^(iπ) + 1 = 0',
      description: '数学中最美的公式',
    },
  },
  {
    image: '/hero-2.jpg',
    formula: {
      title: '波动方程',
      content: '∂²u/∂t² = c²∇²u',
      description: '电磁波传播规律',
    },
  },
  {
    image: '/hero-3.jpeg',
    formula: {
      title: '雷达方程',
      content: 'Pᵣ = PₜG²λ²σ/(4π)³R⁴',
      description: '雷达探测距离公式',
    },
  },
  {
    image: '/hero-4.jpeg',
    formula: {
      title: '麦克斯韦方程组',
      content: '∇ × H = J + ∂D/∂t',
      description: '安培-麦克斯韦定律',
    },
  },
];

const ImageCarousel = ({ isDark, scrollY }: { isDark: boolean; scrollY: number }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(carouselData.length).fill(false));
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const cardRef = useRef<HTMLDivElement>(null);

  const SLIDE_DURATION = 8000;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * 8,
      y: (x - 0.5) * -8,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setProgress(0);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselData.length);
      setIsTransitioning(false);
    }, 700);
  }, []);

  useEffect(() => {
    intervalRef.current = setInterval(nextSlide, SLIDE_DURATION);

    progressRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (100 / (SLIDE_DURATION / 50));
      });
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [nextSlide]);

  const handleSlideChange = (index: number) => {
    if (index === currentIndex) return;
    setIsTransitioning(true);
    setProgress(0);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 700);
  };

  const handleImageLoad = (index: number) => {
    setImagesLoaded(prev => {
      const newState = [...prev];
      newState[index] = true;
      return newState;
    });
  };

  const currentSlide = carouselData[currentIndex];

  return (
    <div
      className="relative w-full max-w-2xl lg:max-w-3xl transition-transform duration-100 ease-out"
      style={{ transform: `translateY(${scrollY * -0.03}px)` }}
    >
      <div className="relative group" style={{ perspective: '1000px' }}>
        <ParticleField isDark={isDark} />
        
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-cyan-500/20 blur-3xl rounded-[2.5rem] opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />

        <div 
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`relative rounded-[1.5rem] p-2 transition-all duration-300 ${
            isDark
              ? 'bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/60 shadow-2xl shadow-black/30'
              : 'bg-white border border-slate-200/70 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.15)]'
          }`}
          style={{
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="relative overflow-hidden rounded-2xl aspect-video bg-slate-100">
            {carouselData.map((slide, index) => (
              <div
                key={slide.image}
                className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  index === currentIndex
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                <div
                  className={`absolute inset-0 transition-transform duration-[8000ms] ease-linear ${
                    index === currentIndex ? 'scale-110' : 'scale-100'
                  }`}
                >
                  {!imagesLoaded[index] && (
                    <div className={`absolute inset-0 animate-pulse ${
                      isDark ? 'bg-slate-800' : 'bg-slate-200'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    </div>
                  )}
                  <img
                    ref={el => { imageRefs.current[index] = el; }}
                    src={slide.image}
                    alt={slide.formula.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      imagesLoaded[index] ? 'opacity-100' : 'opacity-0'
                    }`}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    onLoad={() => handleImageLoad(index)}
                  />
                </div>
              </div>
            ))}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            <div
              className={`absolute bottom-4 left-4 right-4 sm:bottom-10 sm:left-10 sm:right-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isTransitioning ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
              }`}
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className={`backdrop-blur-2xl rounded-2xl px-7 py-6 border max-w-sm transition-all duration-500 ${
                isDark
                  ? 'bg-slate-950/85 border-slate-600/40 shadow-2xl shadow-black/40'
                  : 'bg-white/95 border-white/80 shadow-2xl'
              }`}>
                <div className={`flex items-center gap-2.5 mb-4 ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase">
                    {currentSlide.formula.title}
                  </span>
                </div>

                <div className={`text-2xl sm:text-3xl md:text-4xl leading-tight mb-4 font-light tracking-wide ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`} style={{ fontFamily: '"Times New Roman", Georgia, serif', letterSpacing: '0.02em' }}>
                  {currentSlide.formula.content}
                </div>

                <div className={`text-[11px] sm:text-xs leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  {currentSlide.formula.description}
                </div>

                <div className={`mt-5 h-px w-16 bg-gradient-to-r ${
                  isDark ? 'from-blue-500/60 to-transparent' : 'from-blue-500/40 to-transparent'
                }`} />
              </div>
            </div>

            <div className={`absolute top-4 right-4 sm:top-6 sm:right-6 backdrop-blur-xl px-4 py-2 rounded-full border shadow-lg ${
              isDark
                ? 'bg-slate-950/70 border-slate-700/50 text-slate-300'
                : 'bg-white/80 border-white/60 text-slate-600'
            }`}>
              <span className="text-xs font-bold">
                <span className="text-blue-500">{String(currentIndex + 1).padStart(2, '0')}</span>
                <span className="mx-1.5 opacity-40">/</span>
                <span className="opacity-40">{String(carouselData.length).padStart(2, '0')}</span>
              </span>
            </div>
          </div>

          <div className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full overflow-hidden ${
            isDark ? 'bg-slate-700/30' : 'bg-slate-200/50'
          }`}>
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-700" />
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-700" />
      </div>

      <div className="mt-8 flex items-center justify-between px-2">
        <div className="flex gap-2">
          {carouselData.map((slide, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className={`relative w-14 h-10 rounded-xl overflow-hidden transition-all duration-300 ${
                index === currentIndex
                  ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent scale-110'
                  : isDark 
                    ? 'opacity-40 hover:opacity-70 grayscale hover:grayscale-0' 
                    : 'opacity-50 hover:opacity-80 grayscale hover:grayscale-0'
              }`}
              title={slide.formula.title}
            >
              <img
                src={slide.image}
                alt=""
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                loading="lazy"
              />
              {index === currentIndex && (
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/30 to-transparent" />
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleSlideChange((currentIndex - 1 + carouselData.length) % carouselData.length)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600 hover:text-white shadow-lg shadow-black/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 shadow-md hover:shadow-lg'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => handleSlideChange((currentIndex + 1) % carouselData.length)}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 ${
              isDark
                ? 'bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600 hover:text-white shadow-lg shadow-black/20'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 shadow-md hover:shadow-lg'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

const MagneticButton = ({ children, onClick, className }: { children: React.ReactNode; onClick?: () => void; className?: string }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Button
      ref={buttonRef}
      size="lg"
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {children}
    </Button>
  );
};

const ElegantBackground = ({ isDark }: { isDark: boolean }) => (
  <div className="absolute inset-0 overflow-hidden">
    <div
      className={`absolute inset-0 transition-opacity duration-1000 ${
        isDark
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-slate-50 via-white to-blue-50/30'
      }`}
    />

    <div className="absolute inset-0 opacity-30">
      <div 
        className={`absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[120px] animate-aurora-slow ${
          isDark ? 'bg-blue-600/20' : 'bg-blue-400/20'
        }`}
        style={{ animationDuration: '15s' }}
      />
      <div 
        className={`absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[100px] animate-aurora-slow ${
          isDark ? 'bg-indigo-600/15' : 'bg-indigo-400/15'
        }`}
        style={{ animationDuration: '20s', animationDelay: '-5s' }}
      />
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[80px] animate-aurora-slow ${
          isDark ? 'bg-cyan-600/10' : 'bg-cyan-400/10'
        }`}
        style={{ animationDuration: '18s', animationDelay: '-10s' }}
      />
    </div>

    <div 
      className="absolute inset-0 opacity-[0.4]"
      style={{
        backgroundImage: `radial-gradient(${isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)'} 1px, transparent 1px)`,
        backgroundSize: '32px 32px',
      }}
    />

    {!isDark && (
      <>
        <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-blue-200/30 to-transparent rounded-full blur-3xl opacity-40 animate-pulse-slow" />
        <div className="absolute bottom-32 left-32 w-80 h-80 bg-gradient-to-tr from-indigo-200/25 to-transparent rounded-full blur-3xl opacity-30 animate-pulse-slow" style={{ animationDelay: '2s' }} />
      </>
    )}

    <div 
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 1px, transparent 1px),
                          linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }}
    />
  </div>
);

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    setIsLoaded(true);
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="home" 
      className="relative min-h-screen w-full overflow-hidden"
    >
      <ElegantBackground isDark={isDark} />

      <div 
        className="relative z-10 min-h-screen flex items-center"
        style={{ 
          paddingTop: '120px',
          paddingBottom: '80px',
          transform: `translateY(${scrollY * 0.15}px)` 
        }}
      >
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
            <div className="lg:col-span-5 space-y-10">
              <div
                className={`inline-flex transition-all duration-700 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                <span className={`text-xs font-semibold tracking-[0.2em] uppercase ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  航天科工集团 · 微波技术
                </span>
              </div>

              <h1
                className={`space-y-2 transition-all duration-1000 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ 
                  transitionDelay: '300ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' 
                }}
              >
                <span className={`block text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.1] ${
                  isDark ? 'text-white' : 'text-slate-900'
                }`}>
                  驾驭电磁波
                </span>
                <span className="block text-4xl sm:text-5xl lg:text-[3.25rem] font-semibold tracking-tight leading-[1.1] bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent animate-gradient-x">
                  连接天地
                </span>
              </h1>

              <p
                className={`text-base sm:text-lg leading-relaxed max-w-md transition-all duration-700 ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ 
                  transitionDelay: '450ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' 
                }}
              >
                以麦克斯韦方程组为理论基础，专注于微波技术研发与应用，为航天事业提供先进的射频与微波解决方案。
              </p>

              <div
                className={`flex gap-10 pt-2 transition-all duration-700 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: '550ms' }}
              >
                {[
                  { value: '30+', label: '年技术积累' },
                  { value: '40GHz', label: '工作频率' },
                  { value: '200+', label: '研发人员' },
                ].map((stat, index) => (
                  <div key={stat.label} className={index > 0 ? 'relative pl-10' : ''}>
                    {index > 0 && (
                      <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-px h-8 ${
                        isDark ? 'bg-slate-800' : 'bg-slate-200'
                      }`} />
                    )}
                    <div className={`text-2xl font-semibold ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {stat.value}
                    </div>
                    <div className={`text-xs mt-1 ${
                      isDark ? 'text-slate-500' : 'text-slate-500'
                    }`}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className={`pt-4 transition-all duration-600 ${
                  isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ 
                  transitionDelay: '650ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' 
                }}
              >
                <MagneticButton
                  className={`group relative px-8 py-4 text-sm font-medium rounded-full transition-all duration-300 ${
                    isDark
                      ? 'bg-white text-slate-900 hover:bg-slate-100'
                      : 'bg-slate-900 text-white hover:bg-slate-800'
                  }`}
                  onClick={() => scrollToSection('about')}
                >
                  <span className="flex items-center gap-2">
                    探索技术
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </MagneticButton>
              </div>
            </div>

            <div
              className={`lg:col-span-7 relative flex justify-center lg:justify-end transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
              style={{
                transitionDelay: '400ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <ImageCarousel isDark={isDark} scrollY={scrollY} />
            </div>
          </div>
        </div>
      </div>

      <div
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-20 transition-all duration-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '900ms' }}
      >
        <button
          onClick={() => scrollToSection('about')}
          className={`flex flex-col items-center gap-2 transition-all duration-300 ${
            isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className={`w-px h-8 bg-gradient-to-b ${
            isDark ? 'from-transparent via-slate-600 to-slate-600' : 'from-transparent via-slate-300 to-slate-300'
          }`} />
        </button>
      </div>
    </section>
  );
}
