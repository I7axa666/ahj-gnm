export default function validate(string) {
  return /^[+-[]?([0-1]?\d?\d.)\d{0,5},\s?\S?([0-1]?[0-9]?\d.)\d{0,5}]?$/.test(string);
}
