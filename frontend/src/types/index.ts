export interface User {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  avatar: string | null;
  role: "USER" | "ADMIN";
}

export interface Field {
  id: string;
  name: string;
  description: string | null;
  type: string;
  imageUrl: string | null;
  isActive: boolean;
  pricingRules: PricingRule[];
}

export interface PricingRule {
  id: string;
  fieldId: string;
  label: string;
  startTime: string;
  endTime: string;
  pricePerHour: number;
  isWeekend: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  price: number;
}

export interface FieldAvailability {
  field: string;
  date: string;
  slots: TimeSlot[];
}

export interface Booking {
  id: string;
  userId: string;
  fieldId: string;
  field: Field;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "CANCELLED";
  playerName: string | null;
  playerPhone: string | null;
  playerEmail: string | null;
  notes: string | null;
  createdAt: string;
}

export interface Review {
  id: string;
  userId: string;
  user: { id: string; name: string | null; avatar: string | null };
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface Contact {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  howDidYouHear?: string;
  agreedTerms: boolean;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  order: number;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  imageUrl: string | null;
}
