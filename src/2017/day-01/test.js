const test = require('ava')
const { captcha } = require('./')
const [input] = require('../../helpers/readInput')(__dirname)

test('Day 1.1', t => {
  t.is(captcha('1122', 1), 3)
  t.is(captcha('1111', 1), 4)
  t.is(captcha('1234', 1), 0)
  t.is(captcha('91212129', 1), 9)
})

test('Day 1.2', t => {
  t.is(captcha('1212'), 6)
  t.is(captcha('1221'), 0)
  t.is(captcha('123425'), 4)
  t.is(captcha('123123'), 12)
  t.is(captcha('12131415'), 4)
})

test('Day 1 — Solutions', t => {
  t.is(captcha(input, 1), 1253)
  t.is(captcha(input), 1278)
})
