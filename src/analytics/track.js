export function track(event, data = {}) {
  try {
    // Google gtag
    if (typeof window !== 'undefined') {
      if (window.gtag) {
        window.gtag('event', event, data);
        return;
      }
      // Generic dataLayer push
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({ event, ...data });
        return;
      }
    }
  } catch (e) {
    // Swallow analytics errors
  }
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.debug('[track]', event, data);
  }
}
