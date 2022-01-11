const $ = require('../../helpers')

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')
const makeRegExp = pairs => new RegExp('(' + pairs.join('|') + ')')
const GLOBAL_RE = makeRegExp(
  ALPHABET.map(letter => [
    letter + letter.toUpperCase(),
    letter.toUpperCase() + letter,
  ]).flat()
)

const findShortestPolymer = input =>
  Math.min(
    ...ALPHABET.map(letter => new RegExp(letter, 'ig'))
      .map(re => input.replace(re, ''))
      .map(polymer => reduce(polymer))
      .map(polymer => polymer.length)
  )

const peek = stack => stack[stack.length - 1]

const reduce = input => {
  // This is my initial version, which works fine but is super slow because it
  // uses a big regular expression on a big string I guess.
  /*
  while (GLOBAL_RE.test(input)) input = input.replace(GLOBAL_RE, '')
  return input
  */

  // This version has been taken from Reddit, and is incredibly faster than mine
  // considering it relies on the fact that XOR of A and a, B and b, etc is 32.
  // https://www.reddit.com/r/adventofcode/comments/a3912m/2018_day_5_solutions/
  return Array.from(input)
    .reduce((acc, char) => {
      if (!acc.length || (peek(acc).charCodeAt() ^ char.charCodeAt()) !== 32)
        acc.push(char)
      else acc.pop()
      return acc
    }, [])
    .join('')
}

module.exports = { reduce, findShortestPolymer }
