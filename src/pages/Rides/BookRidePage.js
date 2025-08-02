import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ridesAPI } from '../../services/api';
import {
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  TruckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import toast from 'react-hot-toast';

const BookRidePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const watchPickup = watch('pickup');
  const watchDrop = watch('drop');
  const watchScheduleTime = watch('scheduleTime');

  // Calculate estimated fare based on distance (simplified)
  const calculateFare = () => {
    if (!watchPickup || !watchDrop) return 0;
    // Simple fare calculation (in real app, this would use actual distance)
    const baseFare = 50;
    const distanceMultiplier = 15; // per km
    const estimatedDistance = Math.random() * 20 + 5; // 5-25 km
    return Math.round(baseFare + (estimatedDistance * distanceMultiplier));
  };

  const estimatedFare = calculateFare();

  const createRideMutation = useMutation({
    mutationFn: (rideData) => ridesAPI.createRide(rideData),
    onSuccess: (data) => {
      toast.success('Ride booked successfully!');
      queryClient.invalidateQueries({ queryKey: ['userRides'] });
      navigate('/rides');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to book ride');
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const rideData = {
        pickup: data.pickup,
        drop: data.drop,
        scheduleTime: new Date(data.scheduleTime).toISOString(),
        estimatedFare: estimatedFare,
      };

      await createRideMutation.mutateAsync(rideData);
    } catch (error) {
      console.error('Booking error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const popularLocations = [
    'Office Building A, Sector 5, Bangalore',
    'Kempegowda International Airport, Bangalore',
    'Bangalore Central Mall, MG Road',
    'Tech Park, Electronic City',
    'UB City, Vittal Mallya Road',
  ];

  const QuickLocationButton = ({ location, type }) => (
    <button
      type="button"
      onClick={() => setValue(type, location)}
      className="text-left p-3 rounded-lg border border-gray-200 hover:border-rapido-300 hover:bg-rapido-50 transition-colors duration-200"
    >
      <div className="flex items-center space-x-2">
        <MapPinIcon className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-700">{location}</span>
      </div>
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Ride</h1>
        <p className="text-gray-600">Schedule your corporate ride with ease</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <div className="bg-white rounded-xl shadow-soft p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Pickup Location */}
              <div>
                <Input
                  label="Pickup Location"
                  placeholder="Enter pickup address"
                  error={errors.pickup?.message}
                  leftIcon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
                  {...register('pickup', {
                    required: 'Pickup location is required',
                    minLength: {
                      value: 10,
                      message: 'Please enter a detailed address',
                    },
                  })}
                />
              </div>

              {/* Drop Location */}
              <div>
                <Input
                  label="Drop Location"
                  placeholder="Enter drop address"
                  error={errors.drop?.message}
                  leftIcon={<MapPinIcon className="h-5 w-5 text-gray-400" />}
                  {...register('drop', {
                    required: 'Drop location is required',
                    minLength: {
                      value: 10,
                      message: 'Please enter a detailed address',
                    },
                  })}
                />
              </div>

              {/* Schedule Time */}
              <div>
                <Input
                  label="Schedule Time"
                  type="datetime-local"
                  error={errors.scheduleTime?.message}
                  leftIcon={<CalendarIcon className="h-5 w-5 text-gray-400" />}
                  {...register('scheduleTime', {
                    required: 'Schedule time is required',
                    validate: (value) => {
                      const selectedTime = new Date(value);
                      const now = new Date();
                      const minTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
                      
                      if (selectedTime < minTime) {
                        return 'Please schedule at least 2 hours in advance';
                      }
                      return true;
                    },
                  })}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Minimum 2 hours advance booking required
                </p>
              </div>

              {/* Estimated Fare */}
              {watchPickup && watchDrop && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-rapido-50 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TruckIcon className="h-5 w-5 text-rapido-600" />
                      <span className="font-medium text-gray-900">Estimated Fare</span>
                    </div>
                    <span className="text-2xl font-bold text-rapido-600">
                      ₹{estimatedFare}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    *Final fare may vary based on actual distance and traffic
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isSubmitting}
                disabled={!watchPickup || !watchDrop || !watchScheduleTime}
                className="mt-6"
              >
                Book Ride
              </Button>
            </form>
          </div>
        </motion.div>

        {/* Quick Actions & Popular Locations */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  tomorrow.setHours(9, 0, 0, 0);
                  setValue('scheduleTime', tomorrow.toISOString().slice(0, 16));
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-rapido-300 hover:bg-rapido-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">Tomorrow 9:00 AM</span>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
              </button>
              
              <button
                type="button"
                onClick={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  nextWeek.setHours(9, 0, 0, 0);
                  setValue('scheduleTime', nextWeek.toISOString().slice(0, 16));
                }}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-rapido-300 hover:bg-rapido-50 transition-colors duration-200"
              >
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-700">Next Week</span>
                </div>
                <ArrowRightIcon className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Popular Locations */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Locations</h3>
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Pickup Locations</h4>
                <div className="space-y-2">
                  {popularLocations.slice(0, 3).map((location, index) => (
                    <QuickLocationButton
                      key={`pickup-${index}`}
                      location={location}
                      type="pickup"
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Drop Locations</h4>
                <div className="space-y-2">
                  {popularLocations.slice(2, 5).map((location, index) => (
                    <QuickLocationButton
                      key={`drop-${index}`}
                      location={location}
                      type="drop"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-rapido-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Tips</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-rapido-600 rounded-full mt-2"></div>
                <p>Book at least 2 hours in advance for better approval</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-rapido-600 rounded-full mt-2"></div>
                <p>Provide detailed addresses with landmarks</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-rapido-600 rounded-full mt-2"></div>
                <p>Include contact number for driver coordination</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BookRidePage; 