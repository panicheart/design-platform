import { Radio, Mail, Phone, MapPin } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { useTheme } from '@/components/ThemeProvider';

const footerLinks = {
  product: [
    { name: '关于', href: '#about' },
    { name: '技术', href: '#services' },
    { name: '产品', href: '#projects' },
    { name: '荣誉', href: '#achievements' },
    { name: '文化', href: '#culture' },
  ],
  contact: [
    { icon: MapPin, text: '北京市海淀区航天路88号\n航天科工集团微波室' },
    { icon: Phone, text: '+86 10 8888 8888' },
    { icon: Mail, text: 'microwave@casic.cn' },
  ],
};

export default function Footer() {
  const { ref: footerRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const scrollToSection = (href: string) => {
    const id = href.replace('#', '');
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      id="contact"
      ref={footerRef as React.RefObject<HTMLElement>}
      className={`relative py-20 overflow-hidden transition-colors duration-500 ${
        isDark 
          ? 'bg-slate-950' 
          : 'bg-gradient-to-b from-slate-50 to-white border-t border-slate-200/50'
      }`}
    >
      {isDark && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/10 via-slate-950 to-slate-950" />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div
            className={`lg:col-span-2 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-xl ${
                isDark ? 'bg-blue-500/20' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/60'
              }`}>
                <Radio className={`w-6 h-6 ${isDark ? 'text-blue-500' : 'text-blue-600'}`} />
              </div>
              <div>
                <span className={`font-display text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  微波室
                </span>
                <span className={`block text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  航天科工集团
                </span>
              </div>
            </div>

            <p className={`leading-relaxed mb-8 max-w-md ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              以麦克斯韦方程为理论基础，专注于微波技术研发与应用，
              为航天事业提供先进的射频与微波解决方案。
            </p>
          </div>

          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '100ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <h3 className={`font-display text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              快速链接
            </h3>

            <ul className="space-y-4">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollToSection(link.href); }}
                    className={`transition-colors duration-300 ${
                      isDark 
                        ? 'text-slate-400 hover:text-blue-400' 
                        : 'text-slate-500 hover:text-blue-600'
                    }`}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: '200ms', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            <h3 className={`font-display text-lg font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              联系我们
            </h3>

            <ul className="space-y-4">
              {footerLinks.contact.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <item.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isDark ? 'text-blue-500' : 'text-blue-600'}`} />
                  <span className={`whitespace-pre-line ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`pt-8 border-t ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className={`text-sm text-center sm:text-left ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
              © 2024 航天科工集团微波室. 保留所有权利.
            </p>

            <div className="flex gap-6">
              <a href="#" className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}>
                隐私政策
              </a>
              <a href="#" className={`text-sm transition-colors duration-300 ${
                isDark ? 'text-slate-500 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}>
                使用条款
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
