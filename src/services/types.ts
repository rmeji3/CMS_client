export interface Auth {
  tokenType: string;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface Profile {
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

export interface About {
  title: string;
  description: string;
  imageUrl?: string;
}

export interface Socials {
  email?: string | null;
  phone?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  tiktok?: string | null;
  twitter?: string | null;
}
export interface Address {
  street?: string | null;
  city?: string | null;
  state?: string | null;
  zipcode?: string | null;
}

export interface CarouselItem {
  id: number;
  imageUrl: string;
  description?: string;
  carouselEntityId: number;
}

export interface CarouselEntity {
  id: number;
  tenantId: string;
  items: CarouselItem[];
}