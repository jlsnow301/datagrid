import { z } from "zod";
import { RowData } from "./types";

/** Returns a generic primitive based on input.  */
export function getGenericValue(value: any) {
  if (typeof value === "string") {
    return "";
  } else if (typeof value === "boolean") {
    return false;
  } else if (typeof value === "number") {
    return -1;
  } else return "";
}

/** Tries to get a readable name from row data. */
export function getDisplayName(data: RowData | undefined) {
  if (!data) return "";
  const name = data.Name || data.Label || Object.values(data)[1];
  return name.toString() || "";
}

/** Creates a Zod schema from an object. */
export function getZodSchema(content: RowData, optionalKeys: string[] = []) {
  if (Object.entries(content)?.length === 0) return z.object({});
  const schema = z.object(
    Object.fromEntries(
      Object.entries(content)
        .slice(1)
        .map(([key, value]) => {
          const isOptional = optionalKeys.includes(key);
          if (typeof value === "number") {
            return [key, isOptional ? z.number().optional() : z.number()];
          } else if (typeof value === "string") {
            return [key, isOptional ? z.string() : z.string().min(1)];
          } else if (typeof value === "boolean") {
            return [key, z.boolean()];
          } else {
            console.warn("Unsupported type in table constructor.");
            return [key, z.any()];
          }
        })
    )
  );
  return schema;
}
