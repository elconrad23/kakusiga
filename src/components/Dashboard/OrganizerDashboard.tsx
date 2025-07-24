import React, { useState } from 'react';
import { Plus, Calendar, Users, TrendingUp, DollarSign, MapPin, Clock, Ticket, BarChart3, Settings } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../Events/EventCard';
import { Event } from '../../types';

interface OrganizerDashboardProps {
  activeTab: string;
}

const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ activeTab }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    price: '',
    capacity: '',
    category: 'Adventure',
    image: ''
  });

  const { addEvent, getOrganizerEvents } = useEvents();
  const { user } = useAuth();

  const organizerEvents = user ? getOrganizerEvents(user.id) : [];
  const totalRevenue = organizerEvents.reduce((sum, event) => sum + (event.booked * event.price), 0);
  const totalBookings = organizerEvents.reduce((sum, event) => sum + event.booked, 0);

  const categories = ['Adventure', 'Safari', 'Cultural', 'Food', 'Music', 'Sports', 'Other'];
  const sampleImages = [
    'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?w=500&h=300&fit=crop',
    'https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?w=500&h=300&fit=crop',
    'https://images.pexels.com/photos/1586298/pexels-photo-1586298.jpeg?w=500&h=300&fit=crop',
    'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=500&h=300&fit=crop'
  ];

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newEvent: Omit<Event, 'id' | 'booked'> = {
      title: formData.title,
      description: formData.description,
      location: formData.location,
      date: formData.date,
      time: formData.time,
      price: Number(formData.price),
      capacity: Number(formData.capacity),
      organizerId: user.id,
      organizerName: user.name,
      image: formData.image || sampleImages[Math.floor(Math.random() * sampleImages.length)],
      category: formData.category,
      featured: false
    };

    addEvent(newEvent);
    setShowCreateForm(false);
    setFormData({
      title: '',
      description: '',
      location: '',
      date: '',
      time: '',
      price: '',
      capacity: '',
      category: 'Adventure',
      image: ''
    });
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Events</p>
              <p className="text-3xl font-bold">{organizerEvents.length}</p>
            </div>
            <Calendar className="text-blue-200" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Bookings</p>
              <p className="text-3xl font-bold">{totalBookings}</p>
            </div>
            <Users className="text-green-200" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold">UShs {totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="text-purple-200" size={32} />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Avg. Attendance</p>
              <p className="text-3xl font-bold">
                {organizerEvents.length ? Math.round((totalBookings / organizerEvents.length) * 100) / 100 : 0}%
              </p>
            </div>
            <TrendingUp className="text-orange-200" size={32} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Events</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Plus size={18} className="mr-2" />
            Create Event
          </button>
        </div>

        {organizerEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500 text-lg">No events created yet</p>
            <p className="text-gray-400 mb-4">Start by creating your first event!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organizerEvents.slice(0, 6).map(event => (
              <EventCard
                key={event.id}
                event={event}
                showBookButton={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Calendar className="mr-2 text-blue-600" size={24} />
          My Events
        </h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <Plus size={18} className="mr-2" />
          Create Event
        </button>
      </div>

      {organizerEvents.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500 text-lg">No events created yet</p>
          <p className="text-gray-400">Start creating amazing experiences for tourists!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizerEvents.map(event => (
            <EventCard
              key={event.id}
              event={event}
              showBookButton={false}
            />
          ))}
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <Ticket className="mr-2 text-blue-600" size={24} />
        Event Bookings
      </h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {organizerEvents.map(event => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-10 h-10 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{event.title}</p>
                        <p className="text-sm text-gray-500">{event.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{event.booked} / {event.capacity}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      UShs {(event.booked * event.price).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      event.booked === event.capacity
                        ? 'bg-red-100 text-red-800'
                        : event.booked > event.capacity * 0.8
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {event.booked === event.capacity ? 'Sold Out' : 
                       event.booked > event.capacity * 0.8 ? 'Nearly Full' : 'Available'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <BarChart3 className="mr-2 text-blue-600" size={24} />
        Analytics
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Events</span>
              <span className="font-semibold">{organizerEvents.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Bookings</span>
              <span className="font-semibold">{totalBookings}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Revenue</span>
              <span className="font-semibold">UShs {totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Event Revenue</span>
              <span className="font-semibold">
                UShs {organizerEvents.length ? Math.round(totalRevenue / organizerEvents.length).toLocaleString() : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Events</h3>
          <div className="space-y-3">
            {organizerEvents
              .sort((a, b) => (b.booked * b.price) - (a.booked * a.price))
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-8 h-8 rounded object-cover"
                    />
                    <span className="text-sm font-medium text-gray-900 truncate">{event.title}</span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    UShs {(event.booked * event.price).toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
            <input
              type="text"
              value="Event Organizer"
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
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'events' && renderEvents()}
      {activeTab === 'bookings' && renderBookings()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'settings' && renderSettings()}

      {/* Create Event Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Event</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Plus className="rotate-45" size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Amazing Safari Adventure"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                    placeholder="Describe your amazing event..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Nairobi, Kenya"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="time"
                        required
                        value={formData.time}
                        onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (UShs)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="5000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Leave empty for a random stock photo</p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;