function genRandomString(length: number, characters: string) {
  let str = '';
  for (let i = 0; i < length; i++) {
    str += characters[Math.floor(Math.random() * characters.length)];
  }
  return str;
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
