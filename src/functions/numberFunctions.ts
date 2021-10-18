export function commafy(num: number) {
  return ('' + num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
