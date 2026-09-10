import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Custom utility (clsx + twMerge) — merges conditional class names without Tailwind conflicts
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
