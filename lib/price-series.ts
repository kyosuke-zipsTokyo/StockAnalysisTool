export interface OHLC {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Deterministic PRNG (mulberry32) so the same stock code always renders the
// same synthetic series across page loads/devices.
function mulberry32(seed: number) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hashCode(str: string) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0
  }
  return h
}

/**
 * Generates a synthetic (fake) daily OHLC series using a seeded geometric
 * Brownian-motion-style random walk. This is NOT real market data — it exists
 * so the statistics engine (SMA/RSI/trend tendency) has something realistic
 * to compute over for the demo.
 */
export function generatePriceSeries(
  code: string,
  basePrice: number,
  driftPctAnnual: number,
  volPctAnnual: number,
  days = 260,
): OHLC[] {
  const rand = mulberry32(hashCode(code) ^ 0x9e3779b9)
  const dailyDrift = driftPctAnnual / 100 / 252
  const dailyVol = volPctAnnual / 100 / Math.sqrt(252)

  const dates: Date[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  while (dates.length < days) {
    cursor.setDate(cursor.getDate() - 1)
    const day = cursor.getDay()
    if (day !== 0 && day !== 6) dates.unshift(new Date(cursor))
  }

  const series: OHLC[] = []
  let price = basePrice
  for (const date of dates) {
    const u1 = Math.max(rand(), 1e-9)
    const u2 = rand()
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    const ret = dailyDrift + dailyVol * z
    const open = price
    price = Math.max(price * (1 + ret), 1)
    const close = price
    const high = Math.max(open, close) * (1 + rand() * 0.01)
    const low = Math.min(open, close) * (1 - rand() * 0.01)
    const volume = Math.round(400_000 + rand() * 1_600_000)
    series.push({
      date: date.toISOString().slice(0, 10),
      open,
      high,
      low,
      close,
      volume,
    })
  }
  return series
}
