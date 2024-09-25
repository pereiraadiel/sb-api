// import { customAlphabet } from "nanoid";

function genRandomString(length: number, characters: string) {
  // return customAlphabet(characters, length)();
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 *
 * @returns a random hex string of 10 characters
 */
export function generatePhysicalCode() {
  const characters = 'ABCDEF0123456789';
  return genRandomString(10, characters);
}

/**
 *
 * @param length number (default 6)
 * @returns random string of numbers
 */
export function generateCode(length = 6) {
  const characters = '0123456789';
  return genRandomString(length, characters);
}

/**
 *
 * @returns random string of numbers and letters (upper and lower case)
 */
export function generateId() {
  const characters =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return genRandomString(10, characters);
}

/**
 *
 * @param length number (default 10)
 * @returns random string of numbers and letters (upper and lower case)
 */
export function generateToken(length = 10) {
  const characters =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return genRandomString(length, characters);
}
