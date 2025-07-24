export interface User {
  id: string;
  email: string;
  name: string;
  type: 'organizer' | 'user';
  phone?: string;
  avatar?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  price: number;
  capacity: number;
  booked: number;
  organizerId: string;
  organizerName: string;
  image: string;
  category: string;
  featured: boolean;
}

export interface Booking {
  id: string;
  eventId: string;
  userId: string;
  quantity: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: string;
  paymentMethod: 'mpesa' | 'card' | 'paypal';
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}