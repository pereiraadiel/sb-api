// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createHash } = require('crypto');

function generateObscureNumber() {
  const currentTimestamp = Math.floor(Date.now() / 1000);
  const minutesSince1970 = Math.floor(currentTimestamp / 60).toString();
  const hash = createHash('sha256').update(minutesSince1970).digest('hex');

  const obscureNumber = parseInt(hash.slice(0, 8).padEnd(0), 16) % 100000000;
  return obscureNumber;
}

console.log(generateObscureNumber());
