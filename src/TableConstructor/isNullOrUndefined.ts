/**
 * A more obvious approach to checking if something is null or undef.
 *
 * Good if you might get back a falsy value like a 0 but don't want to type out
 * if(!value && value !== 0) etc.
 * @link https://developer.mozilla.org/en-US/docs/Glossary/Falsy
 * @example
 * ````ts
 * isNullOrUndefined(undefined); // true
 * isNullOrUndefined(null); // true
 * isNullOrUndefined(0); // false
 * isNullOrUndefined(''); // false
 * isNullOrUndefined(false); // false
 * ````
 */
export const isNullOrUndefined = <TAny>(value: TAny): value is TAny =>
  value === null || value === undefined;
