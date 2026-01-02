
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isValid, toDate } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Safely converts various date-like types to a JavaScript Date object.
 * Handles Firestore Timestamps, strings, numbers, and existing Date objects.
 * Returns null if the input is invalid or cannot be converted.
 * @param value The value to convert to a Date.
 * @returns A Date object or null.
 */
export function toDateSafe(value: any): Date | null {
  if (!value) return null;
  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }
  // Handle Firestore Timestamps
  if (value instanceof Timestamp) {
    return value.toDate();
  }
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate();
  }
  // Handle strings or numbers
  try {
    const d = toDate(new Date(value));
    return isValid(d) ? d : null;
  } catch {
    return null;
  }
}

/**
 * Safely converts a value to a number.
 * Returns 0 if the value is not a valid number.
 * @param value The value to convert.
 * @returns A number.
 */
export function toNumberSafe(value: any): number {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}
