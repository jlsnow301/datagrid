import { z } from "zod";
import {
  CellData,
  ConstructorOption,
  ConstructorOptions,
  RowData,
} from "./types";

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
  if (!options) return "";
  if (options[key]?.number) {
    return -1;
  } else if (options[key]?.boolean) {
    return false;
  } else {
    return "";
  }
}

/** Tries to get a readable name from row data. */
export function getDisplayName(data: RowData | undefined) {
  if (!data) return "";
  const name = data.Name || data.Label || Object.values(data)[1];
  return name?.toString() || "";
}

/** Tries to properly display null data on form */
export function getInitialValue(value: CellData, isID = false) {
  let initialValue: string | number | boolean = "";
  if (value === null) {
    initialValue = "";
  } else if (isID) {
    initialValue = value === -1 ? "" : String(value);
  } else {
    initialValue = value;
  }
  return initialValue;
}

/** Returns an array containing the selections key on options */
export function getSelections(key: string, options?: ConstructorOptions) {
  if (!options || !options[key]) {
    return [];
  }
  return options[key].selections || [];
}

/** Creates a Zod schema from an object. */
export function getZodSchema(content: RowData, options?: ConstructorOptions) {
  return z.object(
    Object.fromEntries(
      Object.entries(content)
        .filter(([key]) => !hasOption(key, options, ["noForm", "hidden"]))
        .map(([key, value]) => {
          const isOptional = hasOption(key, options, "optional");
          if (hasOption(key, options, "number") || typeof value === "number") {
            return [key, z.number()];
          } else if (
            hasOption(key, options, "boolean") ||
            typeof value === "boolean"
          ) {
            return [key, z.boolean()];
          } else if (typeof value === "string") {
            return [
              key,
              isOptional ? z.string().optional() : z.string().min(1),
            ];
          } else {
            return [key, isOptional ? z.any().optional() : z.any()];
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
  if (!options || !options[key]) {
    return false;
  }
  if (typeof option === "string") {
    return Object.keys(options[key]).includes(option);
  }
  if (option instanceof Array) {
    return option.some((opt) => Object.keys(options[key]).includes(opt));
  }
  return false;
}

/**
 * Checks keys against the original.
 * Useful to distinguish if we're editing or inserting data,
 * since the IDs are not included on the "insert" form.
 */
export function hasEqualKeys(newData: RowData, original: RowData) {
  return Object.keys(original).every((key) =>
    Object.keys(newData).includes(key)
  );
}
