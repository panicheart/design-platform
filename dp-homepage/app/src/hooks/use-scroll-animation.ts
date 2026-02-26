import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
}

/**
 * 自定义Hook：用于监听元素进入视口时的滚动动画
 *
 * @param options - 配置选项
 * @param options.threshold - 元素可见比例阈值 (0-1)，默认 0.1
 * @param options.once - 是否只触发一次，默认 true
 * @param options.rootMargin - 视口边距，默认 '0px'
 *
 * @returns ref - 绑定到目标元素的ref
 * @returns isVisible - 元素是否在视口中
 *
 * @example
 * const { ref, isVisible } = useScrollAnimation({ threshold: 0.2 });
 *
 * <div ref={ref} className={isVisible ? 'opacity-100' : 'opacity-0'}>
 *   内容
 * </div>
 */
export function useScrollAnimation(options: UseScrollAnimationOptions = {}) {
  const { threshold = 0.1, once = true, rootMargin = '0px' } = options;
  const ref = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return { ref, isVisible };
}

/**
 * 用于数字计数器的动画Hook
 * 支持prefers-reduced-motion媒体查询
 *
 * @param endValue - 目标数值
 * @param duration - 动画持续时间（毫秒），默认 1500
 * @param isVisible - 是否开始动画
 *
 * @returns count - 当前计数值
 */
export function useAnimatedCounter(
  endValue: number,
  isVisible: boolean,
  duration: number = 1500
) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (!isVisible || hasAnimated) return;

    // 检查用户是否偏好减少动画
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReducedMotion) {
      setCount(endValue);
      setHasAnimated(true);
      return;
    }

    const steps = 60;
    const increment = endValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= endValue) {
        setCount(endValue);
        setHasAnimated(true);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isVisible, endValue, duration, hasAnimated]);

  return count;
}
