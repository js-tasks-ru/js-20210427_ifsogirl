/**
 * sum
 * @param {number} m base
 * @param {number} n index
 * @returns {number}
 */
export default function sum(m, n) {
  if (typeof m !== 'number' || typeof n !== 'number') {
    return NaN;
  }

  return m + n;
}
