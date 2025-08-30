export interface Currency {
  code: string
  name: string
  symbol: string
  locale: string
  decimals: number
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  {
    code: 'COP',
    name: 'Peso Colombiano',
    symbol: '$',
    locale: 'es-CO',
    decimals: 0, // Colombian pesos don't typically use decimal places
  },
  {
    code: 'USD',
    name: 'Dólar Estadounidense',
    symbol: '$',
    locale: 'en-US',
    decimals: 2,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    locale: 'de-DE',
    decimals: 2,
  },
  {
    code: 'GBP',
    name: 'Libra Esterlina',
    symbol: '£',
    locale: 'en-GB',
    decimals: 2,
  },
  {
    code: 'JPY',
    name: 'Yen Japonés',
    symbol: '¥',
    locale: 'ja-JP',
    decimals: 0,
  },
  {
    code: 'CAD',
    name: 'Dólar Canadiense',
    symbol: 'C$',
    locale: 'en-CA',
    decimals: 2,
  },
  {
    code: 'AUD',
    name: 'Dólar Australiano',
    symbol: 'A$',
    locale: 'en-AU',
    decimals: 2,
  },
  {
    code: 'CHF',
    name: 'Franco Suizo',
    symbol: 'CHF',
    locale: 'de-CH',
    decimals: 2,
  },
  {
    code: 'MXN',
    name: 'Peso Mexicano',
    symbol: '$',
    locale: 'es-MX',
    decimals: 2,
  },
  {
    code: 'BRL',
    name: 'Real Brasileño',
    symbol: 'R$',
    locale: 'pt-BR',
    decimals: 2,
  },
]

export const DEFAULT_CURRENCY = 'COP'

export function getCurrency(code: string): Currency | undefined {
  return SUPPORTED_CURRENCIES.find(currency => currency.code === code)
}

export function formatCurrency(
  amount: number | string,
  currencyCode: string,
  options: {
    showSymbol?: boolean
    compact?: boolean
  } = {}
): string {
  const { showSymbol = true, compact = false } = options
  const currency = getCurrency(currencyCode)
  
  if (!currency) {
    return `${amount} ${currencyCode}`
  }

  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (compact && Math.abs(numericAmount) >= 1000000) {
    const compactAmount = numericAmount / 1000000
    const formatted = new Intl.NumberFormat(currency.locale, {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(compactAmount)
    return showSymbol ? `${currency.symbol}${formatted}M` : `${formatted}M ${currencyCode}`
  }

  if (compact && Math.abs(numericAmount) >= 1000) {
    const compactAmount = numericAmount / 1000
    const formatted = new Intl.NumberFormat(currency.locale, {
      minimumFractionDigits: currency.decimals > 0 ? 1 : 0,
      maximumFractionDigits: currency.decimals > 0 ? 1 : 0,
    }).format(compactAmount)
    return showSymbol ? `${currency.symbol}${formatted}K` : `${formatted}K ${currencyCode}`
  }

  const formatted = new Intl.NumberFormat(currency.locale, {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(numericAmount)

  if (showSymbol) {
    // For currencies that use the same symbol (like USD and COP both use $)
    if (currencyCode === 'USD' && currency.symbol === '$') {
      return `US$${formatted}`
    }
    if (currencyCode === 'COP' && currency.symbol === '$') {
      return `$${formatted} COP`
    }
    return `${currency.symbol}${formatted}`
  }

  return `${formatted} ${currencyCode}`
}

// Exchange rate functionality (you might want to integrate with a real API later)
export const MOCK_EXCHANGE_RATES: Record<string, Record<string, number>> = {
  COP: {
    USD: 0.00025, // 1 COP = 0.00025 USD (approximately)
    EUR: 0.00023,
    GBP: 0.0002,
  },
  USD: {
    COP: 4000, // 1 USD = 4000 COP (approximately)
    EUR: 0.92,
    GBP: 0.8,
  },
  EUR: {
    COP: 4348,
    USD: 1.09,
    GBP: 0.87,
  },
  GBP: {
    COP: 5000,
    USD: 1.25,
    EUR: 1.15,
  },
}

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): number {
  if (fromCurrency === toCurrency) {
    return amount
  }

  const rates = MOCK_EXCHANGE_RATES[fromCurrency]
  if (!rates || !rates[toCurrency]) {
    // If no rate available, return original amount
    return amount
  }

  return amount * rates[toCurrency]
}

export function getCurrencySelectOptions() {
  return SUPPORTED_CURRENCIES.map(currency => ({
    value: currency.code,
    label: `${currency.name} (${currency.code})`,
    symbol: currency.symbol,
  }))
}