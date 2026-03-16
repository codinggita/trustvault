import { format } from 'date-fns';

export const formatDate = (value, pattern = 'dd MMM yyyy') => {
  if (!value) {
    return '--';
  }

  return format(new Date(value), pattern);
};

export const formatDateTime = (value) => formatDate(value, 'dd MMM yyyy, hh:mm a');

