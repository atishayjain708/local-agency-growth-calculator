/**
 * Format number as currency (USD)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format percentage
 */
export function formatPercentage(decimal: number): string {
  return `${Math.round(decimal * 100)}%`;
}

/**
 * Format range string
 */
export function formatRange(min: number, max: number, formatter: (n: number) => string): string {
  return `${formatter(min)} to ${formatter(max)}`;
}

