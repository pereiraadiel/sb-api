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
 * @returns a random decimal string of 6 characters
 */
export function generateCode() {
  const characters = '0123456789';
  return genRandomString(6, characters);
}

export function generateId() {
  const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  return genRandomString(10, characters);
}