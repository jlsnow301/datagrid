import { z } from "zod";
import { AnyObject } from "./types";

/** Returns a generic primitive based on input.  */
export function getGenericValue(value: any) {
  if (value instanceof Array) {
    return [];
  } else if (typeof value === "boolean") {
    return false;
  } else if (typeof value === "number") {
    return 0;
  } else return "";
}

/** Checks which input type to use based on value. */
export function getInputType(value: any) {
  if (value instanceof Array) {
    return "array";
  } else if (typeof value === "boolean") {
    return "checkbox";
  } else if (typeof value === "number") {
    return "number";
  } else {
    return "text";
  }
}

/** Creates a Zod schema from an object. */
export function getZodSchema<TData>(content: AnyObject<TData>) {
  if (Object.entries(content)?.length === 0) return z.object({});
  const schema = z.object(
    Object.fromEntries(
      Object.entries(content).map(([key, value]) => {
        if (typeof value === "number") {
          return [key, z.number()];
        } else if (typeof value === "string") {
          return [key, z.string().min(1)];
        } else if (typeof value === "boolean") {
          return [key, z.boolean()];
        } else {
          return [key, z.any()];
        }
      })
    )
  );
  return schema;
}
