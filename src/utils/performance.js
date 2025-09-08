/**
 * Performance Utilities (Legacy + New)
 * Combines legacy performance utilities with new performance monitoring
 */

import performanceMonitor, { measurePerformance, measureComponentRender, recordMetric } from '../services/performance';

// Re-export new performance functions
export { measurePerformance, measureComponentRender, recordMetric };

// Performance optimization utilities
export const preloadCriticalResources = () => {
  // Preload critical images (when they exist)
  const criticalImages = [
    // Add critical image paths here when available
    // '/images/hero-background.webp',
    // '/images/logo.webp'
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
};

export const optimizePerformance = () => {
  // Add performance observer for Core Web Vitals
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('FID:', entry.processingStart - entry.startTime);
      }
    });
    fidObserver.observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    const clsObserver = new PerformanceObserver((list) => {
      let clsValue = 0;
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      console.log('CLS:', clsValue);
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }

  // Preload critical resources
  preloadCriticalResources();

  // Add resource hints for better performance
  const addResourceHint = (href, rel, as = null) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.href = href;
    if (as) link.as = as;
    document.head.appendChild(link);
  };

  // DNS prefetch for external resources
  addResourceHint('https://fonts.googleapis.com', 'dns-prefetch');
  addResourceHint('https://fonts.gstatic.com', 'dns-prefetch');

  // Preconnect to important origins
  addResourceHint('https://fonts.googleapis.com', 'preconnect', 'font');
  addResourceHint('https://fonts.gstatic.com', 'preconnect', 'font');
};

// Initialize performance optimizations
if (typeof window !== 'undefined') {
  // Run optimizations after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizePerformance();
      
      // Initialize performance monitoring
      performanceMonitor.recordMetric('app_initialization', {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
      });
    });
  } else {
    optimizePerformance();
    
    // Initialize performance monitoring
    performanceMonitor.recordMetric('app_initialization', {
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  }
}

// Default export for backward compatibility
export default performanceMonitor;
