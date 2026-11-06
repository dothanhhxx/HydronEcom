// Shared Product Types - Định nghĩa danh mục, trà, biến thể và thuộc tính

export type Category = {
  slug: string;
  name: string;
  desc: string;
  ph: string;
};

export type Purpose = "hang-ngay" | "bieu-tang";
export type Occasion = "tet" | "trung-thu" | "20-10" | "tan-gia";

export type Spec = {
  label: string;
  value: string;
};

export type Brew = {
  temp: string;
  amount: string;
  time: string;
  infusions: string;
  tip: string;
};

export type Product = {
  slug: string;
  name: string;
  category: string;
  kind: string;
  note: string;
  base: number;
  compareAt?: number;
  fixed?: boolean;
  rating: number;
  reviews: number;
  sold: number;
  isNew?: boolean;
  addedAt: string;
  origin: string;
  ph: string;
  gallery: { ph: string; alt: string }[];
  desc: string;
  purposes: Purpose[];
  occasions: Occasion[];
  specs: Spec[];
  brew?: Brew;
  stock?: Record<string, number>;
  active?: boolean;
  deleted?: boolean;
};

export type ProductOverride = {
  base?: number;
  compareAt?: number;
  active?: boolean;
  stock?: Record<string, number>;
  updatedAt?: string;
};
