import type { ImageSourcePropType } from 'react-native';
import { hero as placeholderImage } from '../assets/images/product';
import { API_ORIGIN } from '../services/api';

/** Backend products have no photo yet until vendors upload one — falls back to a
 * bundled placeholder, mirroring the avatarUrl-or-default pattern used for profile photos. */
export function resolveProductImage(imageUrl?: string | null): ImageSourcePropType {
  return imageUrl ? { uri: `${API_ORIGIN}${imageUrl}` } : placeholderImage;
}
