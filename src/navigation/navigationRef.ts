import { createNavigationContainerRef } from '@react-navigation/native';
import type { AuthStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<AuthStackParamList>();

/** Drops the whole stack and lands on Login — used when the session is force-ended. */
export function resetToLogin(): void {
  if (!navigationRef.isReady()) return;
  navigationRef.reset({ index: 0, routes: [{ name: 'Login' }] });
}
