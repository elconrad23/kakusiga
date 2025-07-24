import React, { useState } from 'react';
import { X, CreditCard, Smartphone, DollarSign, Users, Calendar, MapPin } from 'lucide-react';
import { Event } from '../../types';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';

interface BookingModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ event, isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card' | 'paypal'>('mpesa');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');

  const { bookEvent } = useEvents();
  const { user } = useAuth();

  if (!isOpen || !event) return null;

  const totalAmount = event.price * quantity;
  const availableSpots = event.capacity - event.booked;

  const handleBooking = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const success = await bookEvent(event.id, user.id, quantity, paymentMethod);
      if (success) {
        setStep('success');
      } else {
        alert('Booking failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.' +error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('details');
    setQuantity(1);
    setPaymentMethod('mpesa');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'details' && 'Book Event'}
              {step === 'payment' && 'Payment'}
              {step === 'success' && 'Booking Confirmed!'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {step === 'details' && (
            <>
              <div className="mb-6">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-blue-600" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2 text-blue-600" />
                    <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-blue-600" />
                    <span>{availableSpots} spots available</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Tickets
                </label>
                <select
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Array.from({ length: Math.min(availableSpots, 10) }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? 'ticket' : 'tickets'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price per ticket:</span>
                  <span className="font-semibold">UShs {event.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">Total:</span>
                    <span className="text-lg font-bold text-blue-600">
                      UShs {totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setStep('payment')}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Continue to Payment
              </button>
            </>
          )}

          {step === 'payment' && (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="mpesa"
                      checked={paymentMethod === 'mpesa'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'mpesa')}
                      className="mr-3"
                    />
                    <Smartphone className="mr-3 text-green-600" size={20} />
                    <div>
                      <p className="font-medium">M-Pesa</p>
                      <p className="text-sm text-gray-500">Pay with your mobile money</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                      className="mr-3"
                    />
                    <CreditCard className="mr-3 text-blue-600" size={20} />
                    <div>
                      <p className="font-medium">Credit/Debit Card</p>
                      <p className="text-sm text-gray-500">Visa, Mastercard, etc.</p>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'paypal')}
                      className="mr-3"
                    />
                    <DollarSign className="mr-3 text-purple-600" size={20} />
                    <div>
                      <p className="font-medium">PayPal</p>
                      <p className="text-sm text-gray-500">Pay with PayPal balance</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Total Amount:</span>
                  <span className="text-xl font-bold text-blue-600">
                    UShs {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep('details')}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleBooking}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {loading ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </>
          )}

          {step === 'success' && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600 mb-4">
                  Your booking has been confirmed. You will receive a confirmation email shortly.
                </p>
                
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <h4 className="font-semibold mb-2">Booking Details:</h4>
                  <p className="text-sm text-gray-600 mb-1">Event: {event.title}</p>
                  <p className="text-sm text-gray-600 mb-1">Date: {new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 mb-1">Tickets: {quantity}</p>
                  <p className="text-sm text-gray-600">Total: UShs {totalAmount.toLocaleString()}</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;