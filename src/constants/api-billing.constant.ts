export const BILLING_RATES = {
  API_CALL: 2,
  CURRENCY: 'BDT',
} as const;

export const BILLING_TIERS = [
  { min: 1, max: 5000, rate: 2 }, // First 5000 calls: 2 BDT each
  { min: 5001, max: 15000, rate: 5 }, // Next 10000 calls: 5 BDT each
  { min: 15001, max: null, rate: 8 }, // Beyond 15000: 8 BDT each
] as const;
