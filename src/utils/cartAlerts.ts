import { Alert } from 'react-native';
import { getErrorMessage } from '../services/api';

export function alertCartError(err: unknown): void {
  Alert.alert('Could not update cart', getErrorMessage(err));
}
