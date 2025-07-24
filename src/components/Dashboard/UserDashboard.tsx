import React, { useState } from 'react';
import { Search, Calendar, MapPin, Star, Ticket, CreditCard, Settings } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../Events/EventCard';
import BookingModal from '../Events/BookingModal';
import { Event } from '../../types';

interface UserDashboardProps {
  activeTab: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ activeTab }) => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const { events, getUserBookings } = useEvents();
  const { user } = useAuth();

  const categories = ['all', 'Safari', 'Adventure', 'Cultural', 'Food', 'Music', 'Sports'];
  
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const userBookings = user ? getUserBookings(user.id) : [];

  const handleBookEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsBookingModalOpen(true);
  };

  const renderDiscoverEvents = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search events, locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Featured Events */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Star className="mr-2 text-yellow-500" size={24} />
          Featured Events
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.filter(event => event.featured).map(event => (
            <EventCard
              key={event.id}
              event={event}
              onBook={handleBookEvent}
            />
          ))}
        </div>
      </div>

      {/* All Events */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">All Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onBook={handleBookEvent}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const renderMyBookings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <Ticket className="mr-2 text-blue-600" size={24} />
        My Bookings
      </h2>
      
      {userBookings.length === 0 ? (
        <div className="text-center py-12">
          <Ticket className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No bookings yet</p>
          <p className="text-gray-400">Start exploring events to make your first booking!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userBookings.map(booking => {
            const event = events.find(e => e.id === booking.eventId);
            if (!event) return null;
            
            return (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full sm:w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-2 text-blue-600" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 text-blue-600" />
                        <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-500">
                          {booking.quantity} ticket{booking.quantity > 1 ? 's' : ''} • 
                        </span>
                        <span className="text-lg font-bold text-gray-900 ml-1">
                          UShs {booking.totalAmount.toLocaleString()}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderPaymentHistory = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <CreditCard className="mr-2 text-blue-600" size={24} />
        Payment History
      </h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        <div className="p-6">
          {userBookings.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-500">No payment history available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {userBookings.map(booking => {
                const event = events.find(e => e.id === booking.eventId);
                if (!event) return null;
                
                return (
                  <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{event.title}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.bookingDate).toLocaleDateString()} • 
                        {booking.paymentMethod.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        UShs {booking.totalAmount.toLocaleString()}
                      </p>
                      <p className={`text-xs ${
                        booking.status === 'confirmed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {booking.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <Settings className="mr-2 text-blue-600" size={24} />
        Settings
      </h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={user?.name || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={user?.phone || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {activeTab === 'discover' && renderDiscoverEvents()}
      {activeTab === 'my-bookings' && renderMyBookings()}
      {activeTab === 'payments' && renderPaymentHistory()}
      {activeTab === 'settings' && renderSettings()}
      
      <BookingModal
        event={selectedEvent}
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
      />
    </div>
  );
};

export default UserDashboard;