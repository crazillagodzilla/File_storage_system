import { toast } from 'react-toastify';

export function getErrorMessage(error, fallback = 'Something went wrong') {
  if (error?.response?.data) {
    const data = error.response.data;

    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;
    if (data.message) return data.message;

    const firstKey = Object.keys(data)[0];
    if (firstKey) {
      const value = data[firstKey];
      return Array.isArray(value) ? value[0] : String(value);
    }
  }

  if (error?.message) return error.message;
  return fallback;
}

export function handleApiError(error, fallback) {
  const message = getErrorMessage(error, fallback);
  toast.error(message);
  return message;
}

export function handleApiSuccess(message) {
  toast.success(message);
}
