export type Currency = 'TOMAN' | 'USD' | 'EUR';

export class Price {
  private constructor(
    private readonly _value: bigint,
    private readonly _currency: Currency,
  ) {}

  static create(value: number | string | bigint, currency: Currency = 'TOMAN'): Price {
    const bigintValue = BigInt(value);

    if (bigintValue < 0n) {
      throw new Error('Price cannot be negative');
    }

    return new Price(bigintValue, currency);
  }

  get value(): bigint {
    return this._value;
  }

  get currency(): Currency {
    return this._currency;
  }
}