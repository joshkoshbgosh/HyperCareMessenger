import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function exhaustiveGuard(_value: never): never {
  throw new Error(`ERROR! Reached forbidden guard function with unexpected value: ${JSON.stringify(_value)}`);
}
