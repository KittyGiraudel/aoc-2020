// Return all possible unique combinations of size `n` from given `array`.
const combinations = <T>(array: T[], n: number, start = [], tmp = []): T[][] =>
  array.reduce((acc, item, index, array) => {
    if (n > 1) {
      tmp.push(item)
      combinations(array.slice(index + 1), n - 1, acc, tmp)
    } else {
      acc.push((tmp.push(item), tmp).slice(0))
    }

    tmp.pop()

    return acc
  }, start)

export default combinations
