export interface PromoRule {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  minSubtotal: number;
  maxDiscountAmount?: number;
  expiresAt: Date;
  isActive: boolean;
}

export const PROMO_REGISTRY: Record<string, PromoRule> = {
  MSN10: {
    code: 'MSN10',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minSubtotal: 0,
    expiresAt: new Date('2030-12-31T23:59:59.999Z'),
    isActive: true,
  },
  LAUNCH20: {
    code: 'LAUNCH20',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    minSubtotal: 5000,
    expiresAt: new Date('2030-12-31T23:59:59.999Z'),
    isActive: true,
  },
  EID50: {
    code: 'EID50',
    discountType: 'PERCENTAGE',
    discountValue: 50,
    minSubtotal: 10000,
    maxDiscountAmount: 10000,
    expiresAt: new Date('2030-12-31T23:59:59.999Z'),
    isActive: true,
  },
};

export interface PromoValidationResult {
  valid: boolean;
  message?: string;
  code?: string;
  discountType?: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue?: number;
  discountPercentage?: number;
  discountAmount?: number;
}

export function validatePromoCode(rawCode: string, subtotal: number): PromoValidationResult {
  const code = rawCode.trim().toUpperCase();
  const rule = PROMO_REGISTRY[code];

  if (!rule || !rule.isActive) {
    return { valid: false, message: 'Invalid or inactive promotional coupon code.' };
  }

  if (rule.expiresAt.getTime() < Date.now()) {
    return { valid: false, message: 'This promotional coupon has expired.' };
  }

  if (subtotal < rule.minSubtotal) {
    return {
      valid: false,
      message: `Coupon '${code}' requires a minimum cart subtotal of Rs. ${rule.minSubtotal}.`,
    };
  }

  let discountAmount = 0;
  let discountPercentage = 0;

  if (rule.discountType === 'PERCENTAGE') {
    discountPercentage = rule.discountValue;
    discountAmount = Math.round((subtotal * rule.discountValue) / 100);
    if (rule.maxDiscountAmount && discountAmount > rule.maxDiscountAmount) {
      discountAmount = rule.maxDiscountAmount;
    }
  } else {
    discountAmount = Math.min(rule.discountValue, subtotal);
    discountPercentage = Math.round((discountAmount / subtotal) * 100);
  }

  return {
    valid: true,
    code: rule.code,
    discountType: rule.discountType,
    discountValue: rule.discountValue,
    discountPercentage,
    discountAmount,
  };
}
