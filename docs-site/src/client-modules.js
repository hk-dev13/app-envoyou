// Custom client modules for Docusaurus
// This file provides browser-compatible module loading

// Provide require polyfill for browser environment
if (typeof window !== 'undefined' && typeof require === 'undefined') {
  window.require = function(path) {
    if (path.endsWith('.css')) {
      // For CSS files, dynamically load them
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = path;
      document.head.appendChild(link);
      return {};
    } else {
      // For JS files, use dynamic import
      return import(path);
    }
  };
}

export default [];