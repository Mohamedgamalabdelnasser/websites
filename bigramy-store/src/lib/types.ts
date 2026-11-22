export type Variant = {
  id: number;
  product_id: number;
  shopify_variant_id: number | null;
  title: string;
  price: number;
  compare_at_price: number | null;
  sku: string;
  available: boolean;
  option1: string | null;
  option2: string | null;
  option3: string | null;
};

export type Product = {
  id: number;
  shopify_id: number | null;
  handle: string;
  title: string;
  vendor: string;
  product_type: string;
  tags: string[];
  body_html: string;
  body_text: string;
  images: string[];
  options: { name: string; values: string[] }[];
  status: string;
  variants?: Variant[];
  min_price?: number;
  max_price?: number;
  compare_at?: number | null;
};

export type Collection = {
  id: number;
  handle: string;
  title: string;
  description: string;
  image: string | null;
};

export type OfferType =
  | "specific_mix"
  | "any_quantity"
  | "percent_off"
  | "fixed_amount_off";

export type Offer = {
  id: number;
  name: string;
  description: string;
  offer_type: OfferType;
  status: string;
  fixed_total: number | null;
  discount_amount: number | null;
  discount_percent: number | null;
  min_quantity: number | null;
  items?: OfferItem[];
};

export type OfferItem = {
  id: number;
  offer_id: number;
  product_id: number;
  quantity: number;
  product_handle?: string;
  product_title?: string;
};

export type CartLine = {
  productId: number;
  variantId: number;
  handle: string;
  title: string;
  variantTitle: string;
  price: number;
  image: string | null;
  quantity: number;
};

export type AppliedOffer = {
  offer: Offer;
  discount: number;
  message: string;
};
