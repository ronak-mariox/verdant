import type { ImageSourcePropType } from 'react-native';
import { hero as placeholderImage } from '../assets/images/product';
import { API_ORIGIN } from '../services/api';

/** Backend products have no photo yet until vendors upload one — falls back to a
 * bundled placeholder, mirroring the avatarUrl-or-default pattern used for profile photos.
 * Handles both backend-relative upload paths (`/uploads/xyz.jpg`) and already-absolute
 * URLs (e.g. seeded demo products' placeholder images) without double-prefixing. */
export function resolveProductImage(imageUrl?: string | null): ImageSourcePropType {
  if (!imageUrl) return placeholderImage;
  return /^https?:\/\//.test(imageUrl) ? { uri: imageUrl } : { uri: `${API_ORIGIN}${imageUrl}` };
}
