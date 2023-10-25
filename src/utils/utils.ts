export function getNumbersWithCommaSeparate(v: number) {
  return v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}