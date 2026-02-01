export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size: string;
  externalBuyUrl?: string;
}

export interface BillingData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  city: string;
  province: string;
  address: string;
  postalCode: string;
}

export interface ShippingData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  province: string;
}

export interface CheckoutData {
  billing: BillingData;
  shipping?: ShippingData;
  useDifferentShipping: boolean;
  acceptedTerms: boolean;
  createAccount: boolean;
  password?: string;
}
