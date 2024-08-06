import { parseISO } from "date-fns";

export const dateFromString = (value?: string): Date =>
  value ? (typeof value === "string" ? parseISO(value) : value) : new Date();
