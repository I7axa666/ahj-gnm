export default function validate(string) {
  return /^[-[]?(\d[0-2]\.\d{5}),\s?\S([1-3]?[1-9]?\d\.\d{5})/.test(string);
}
