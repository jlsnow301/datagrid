import { z } from "zod";

import { ConstructorOption, ConstructorOptions, RowData } from "./types";

/** Gets a valid column size based on string inputs */
export function getColumnSize(size?: string) {
  switch (true) {
    case size === "sm":
      return 70;
    case size === "md":
      return 150;
    case size === "lg":
      return 300;
    case size === "xl":
      return 400;
    default:
      return 0;
  }
}

/** Returns a generic primitive based on input.  */
export function getGenericValue(key: string, options?: ConstructorOptions) {
  if (!options?.has(key)) return "";
  if (options.get(key)?.number) {
    return -1;
  } else if (options.get(key)?.boolean) {
    return false;
  } else {
    return "";
  }
}

/** Tries to get a readable name from row data. */
export function getDisplayName(data?: RowData) {
  if (!data) return "";
  const name = data.Name || data.Label || Object.values(data)[1];
  return name?.toString() || "";
}

/** Returns the actual option value */
export function getOption(
  key: string,
  options?: ConstructorOptions,
  option?: keyof ConstructorOption
) {
  if (!options?.has(key) || !option) return;
  return options.get(key)?.[option as keyof ConstructorOption];
}

/** Creates a Zod schema from an object. */
export function getZodSchema(content: RowData, options?: ConstructorOptions) {
  return z.object(
    Object.fromEntries(
      Object.entries(content)
        .filter(([key]) => !hasOption(key, options, ["noForm", "hidden"]))
        .map(([key, value]) => {
          if (hasOption(key, options, "number")) {
            return [key, z.number()];
          } else if (
            hasOption(key, options, "boolean") ||
            typeof value === "boolean"
          ) {
            return [key, z.boolean()];
          } else {
            return [
              key,
              hasOption(key, options, "optional")
                ? z.string().optional()
                : z.string().min(1),
            ];
          }
        })
    )
  );
}

/**
 * Check if the stated key has a certain option.
 * Takes option as a string or an array of strings.
 */
export function hasOption(
  key: string,
  options?: ConstructorOptions,
  option?: keyof ConstructorOption | Array<keyof ConstructorOption>
) {
  if (!options?.has(key) || !option) return false;
  if (typeof option === "string") {
    return option in options.get(key)!;
  }
  if (option instanceof Array) {
    return option.some((opt) => opt in options.get(key)!);
  }
  return false;
}
