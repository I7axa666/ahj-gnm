import validate from '../validate';

test.each([
  ['-51.50851, −0.12572', true],
  ['51.50851,−0.12572', true],
  ['[51.50851, −0.12572]', true],
  ['[a233521.50851, −0.12572]', false],
  ['[21.50851, −0.125b72]', false],
])('validate coords %s toBe %s', (str, bool) => {
  expect(validate(str)).toBe(bool);
});
