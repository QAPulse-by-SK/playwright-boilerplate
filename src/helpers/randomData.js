// @ts-check
/**
 * Random Data Helpers
 * QA Pulse by SK - www.skakarh.com
 */

/** @param {number} length */
function randomString(length = 8) {
  return Math.random().toString(36).substring(2, length + 2);
}

function randomEmail() {
  return `test.${randomString(6)}@qapulse.dev`;
}

/**
 * @param {number} min
 * @param {number} max
 */
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomName() {
  const first = ["Alice", "Bob", "Charlie", "Diana", "Eve"];
  const last = ["Smith", "Jones", "Khan", "Lee", "Brown"];
  return `${first[randomInt(0, 4)]} ${last[randomInt(0, 4)]}`;
}

module.exports = { randomString, randomEmail, randomInt, randomName };
