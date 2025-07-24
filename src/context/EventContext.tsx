import React, { createContext, useContext, useState, useEffect } from 'react';
import { Event, Booking } from '../types';

interface EventContextType {
  events: Event[];
  bookings: Booking[];
  addEvent: (event: Omit<Event, 'id' | 'booked'>) => void;
  bookEvent: (eventId: string, userId: string, quantity: number, paymentMethod: 'mpesa' | 'card' | 'paypal') => Promise<boolean>;
  getUserBookings: (userId: string) => Booking[];
  getOrganizerEvents: (organizerId: string) => Event[];
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Maasai Mara Safari Experience',
    description: 'Experience the incredible wildlife of Maasai Mara with professional guides and luxury accommodations.',
    location: 'Maasai Mara National Reserve',
    date: '2024-03-15',
    time: '06:00',
    price: 12500,
    capacity: 20,
    booked: 8,
    organizerId: 'org1',
    organizerName: 'Safari Adventures Uganda',
    image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?w=500&h=300&fit=crop',
    category: 'Safari',
    featured: true
  },
  {
    id: '2',
    title: 'Mount Rwenzori Climbing Expedition',
    description: 'Challenge yourself with a guided climb up Mount Rwenzori, Africa\'s second-highest peak.',
    location: 'Mount Rwenzori National Park',
    date: '2024-03-20',
    time: '05:00',
    price: 15000,
    capacity: 12,
    booked: 5,
    organizerId: 'org1',
    organizerName: 'Mountain Adventures',
    image: 'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?w=500&h=300&fit=crop',
    category: 'Adventure',
    featured: true
  },
  {
    id: '3',
    title: 'Diani Beach Cultural Festival',
    description: 'Immerse yourself in Coastal Ugandan culture with traditional music, dance, and cuisine.',
    location: 'Lido Beach, Kitoro',
    date: '2024-03-25',
    time: '18:00',
    price: 2500,
    capacity: 200,
    booked: 45,
    organizerId: 'org2',
    organizerName: 'Coastal Events Co.',
    image: 'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?w=500&h=300&fit=crop',
    category: 'Cultural',
    featured: false
  },
  {
    id: '4',
    title: 'Kampala City Food Tour',
    description: 'Discover the flavors of Kampala with visits to local markets and authentic restaurants.',
    location: 'Kampala City Center',
    date: '2024-03-18',
    time: '10:00',
    price: 3500,
    capacity: 15,
    booked: 12,
    organizerId: 'org3',
    organizerName: 'Urban Explorers',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=500&h=300&fit=crop',
    category: 'Food',
    featured: false
  }
];

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);

  const addEvent = (eventData: Omit<Event, 'id' | 'booked'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      booked: 0
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const bookEvent = async (eventId: string, userId: string, quantity: number, paymentMethod: 'mpesa' | 'card' | 'paypal'): Promise<boolean> => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const event = events.find(e => e.id === eventId);
    if (!event || event.capacity - event.booked < quantity) {
      return false;
    }

    const booking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      eventId,
      userId,
      quantity,
      totalAmount: event.price * quantity,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      paymentMethod
    };

    const newBookings = [...bookings, booking];
    setBookings(newBookings);
    localStorage.setItem('bookings', JSON.stringify(newBookings));

    // Update event booking count
    setEvents(prev => prev.map(e => 
      e.id === eventId ? { ...e, booked: e.booked + quantity } : e
    ));

    return true;
  };

  const getUserBookings = (userId: string) => {
    return bookings.filter(booking => booking.userId === userId);
  };

  const getOrganizerEvents = (organizerId: string) => {
    return events.filter(event => event.organizerId === organizerId);
  };

  return (
    <EventContext.Provider value={{
      events,
      bookings,
      addEvent,
      bookEvent,
      getUserBookings,
      getOrganizerEvents
    }}>
      {children}
    </EventContext.Provider>
  );
};