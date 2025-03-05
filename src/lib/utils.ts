import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const isPtalValid = (dob: string) => {
  if (dob.length != 9) {
    return false;
  }
  const weightedSum =
    3 * Number(dob[0]) +
    2 * Number(dob[1]) +
    7 * Number(dob[2]) +
    6 * Number(dob[3]) +
    5 * Number(dob[4]) +
    4 * Number(dob[5]) +
    3 * Number(dob[6]) +
    2 * Number(dob[7]) +
    1 * Number(dob[8]);
  return weightedSum % 11 === 0;
};
