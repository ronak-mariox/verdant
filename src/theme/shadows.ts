import { Platform } from 'react-native';

const create = (color: string, offsetY: number, radius: number, opacity: number, elevation: number) =>
  Platform.select({
    android: { elevation },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
  });

export const shadows = {
  none: {},
  card: create('#000000', 8, 16, 0.1, 4),
  button: create('#22C55E', 8, 12, 0.35, 6),
  buttonSoft: create('#22C55E', 8, 32, 0.4, 8),
  tab: create('#000000', 2, 4, 0.08, 1),
  small: create('#000000', 1, 1.5, 0.1, 1),
} as const;
