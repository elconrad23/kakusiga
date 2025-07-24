import React from 'react';
import { MapPin, Clock, Users, Calendar, Star } from 'lucide-react';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onBook?: (event: Event) => void;
  showBookButton?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onBook, showBookButton = true }) => {
  const availableSpots = event.capacity - event.booked;
  const isFullyBooked = availableSpots === 0;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {event.featured && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <Star size={12} className="mr-1" />
            Featured
          </div>
        )}
        <div className="absolute top-3 right-3 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm font-medium">
          {event.category}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin size={16} className="mr-2 text-blue-600" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Calendar size={16} className="mr-2 text-blue-600" />
            <span>{new Date(event.date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Clock size={16} className="mr-2 text-blue-600" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <Users size={16} className="mr-2 text-blue-600" />
            <span>{availableSpots} spots available</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-gray-900">
              UShs {event.price.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm ml-1">per person</span>
          </div>

          {showBookButton && (
            <button
              onClick={() => onBook?.(event)}
              disabled={isFullyBooked}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                isFullyBooked
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-md hover:shadow-lg'
              }`}
            >
              {isFullyBooked ? 'Fully Booked' : 'Book Now'}
            </button>
          )}
        </div>

        {!isFullyBooked && availableSpots <= 5 && (
          <div className="mt-3 text-center">
            <span className="text-red-600 text-xs font-medium bg-red-50 px-2 py-1 rounded-full">
              Only {availableSpots} spots left!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;