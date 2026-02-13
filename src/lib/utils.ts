
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

  // Handle Firestore Timestamps (instanceof check)
  if (typeof value === 'object' && typeof value.toDate === 'function') {
    try {
      const d = value.toDate();
      return isValid(d) ? d : null;
    } catch {
      return null;
    }
  }

  // Handle serialized Firestore Timestamps (plain objects)
  if (typeof value === 'object' && value.seconds !== undefined && value.nanoseconds !== undefined) {
    try {
      return new Date(value.seconds * 1000 + value.nanoseconds / 1000000);
    } catch {
      return null;
    }
  }

  // Handle numbers
  if (typeof value === 'number') {
    // Basic heuristic: modern timestamps are usually > 900,000,000 (year 2000 in seconds)
    // and < 10,000,000,000,000 (year 2286 in milliseconds)
    if (value < 900000000) return null;
    try {
      const d = new Date(value > 10000000000 ? value : value * 1000);
      return isValid(d) ? d : null;
    } catch {
      return null;
    }
  }

  // Handle strings - Be VERY conservative to avoid converting IDs or Numbers
  if (typeof value === 'string') {
    // Only attempt to parse if it looks like a date (contains - or / and is of reasonable length)
    // or if it matches ISO 8601
    const looksLikeDate = /^\d{4}-\d{2}-\d{2}/.test(value) ||
      /^\d{2}\/\d{2}\/\d{4}/.test(value) ||
      (value.length > 10 && !isNaN(Date.parse(value)));

    if (!looksLikeDate) return null;

    try {
      const d = new Date(value);
      return isValid(d) ? d : null;
    } catch {
      return null;
    }
  }

  return null;
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
