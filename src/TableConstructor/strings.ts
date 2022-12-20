/**
 * Converts a string to title case.
 *
 * Works on camelCase, PascalCase, snake_case, and kebab-case.
 */
export const toTitleCase = (header: string) => {
  if (!header) return "";
  return (
    header.charAt(0).toUpperCase() +
    header
      .slice(1)
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2")
      .replace(/_/g, " ")
      .replace(/-/g, " ")
  );
};
