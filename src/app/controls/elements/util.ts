export function toInteger(value: any): number {
  return parseInt(`${value}`, 10)
}
export function toString(value: any): string {
  return (value !== undefined && value !== null) ? `${value}` : ''
}
export function getValueInRange(value: number, max: number, min = 0): number {
  return Math.max(Math.min(value, max), min)
}
export function isString(value: any): value is string {
  return typeof value === 'string'
}
export function isNumber(value: any): value is number {
  return !isNaN(toInteger(value))
}
export function isInteger(value: any): value is number {
  return typeof value === 'number' && isFinite(value) && Math.floor(value) === value
}
export function padNumber(value: number): string {
  if (isNumber(value)) { return `0${value}`.slice(-2) }
  else { return '' }
}