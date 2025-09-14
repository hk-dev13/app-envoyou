import { registerSW } from 'virtual:pwa-register';
import logger from '../services/logger';

// Provide a callback-based update flow without forcing immediate reload
export const initPWA = () => {
  try {
    const updateSW = registerSW({
      immediate: false,
      onNeedRefresh() {
        logger.info('PWA update available (deferred).');
        // Expose a manual trigger so UI can show a toast/button
        window.__envoyouPWAUpdateReady = true;
        window.__envoyouApplyPWAUpdate = () => {
          logger.info('Applying PWA update...');
          updateSW(true);
        };
      },
      onOfflineReady() {
        logger.info('PWA offline cache ready.');
      },
      onRegistered() {
        logger.debug('PWA registered.');
      },
      onRegisterError(error) {
        logger.warn('PWA registration error', { error });
      }
    });
  } catch (e) {
    logger.warn('PWA init failed', { error: e });
  }
};

export default initPWA;