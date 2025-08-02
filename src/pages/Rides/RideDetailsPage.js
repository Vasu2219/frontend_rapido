import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ridesAPI } from '../../services/api';
import {
  MapPinIcon,
  ClockIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  UserIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const RideDetailsPage = () => {
  const { id } = useParams();

  const { data: rideData, isLoading } = useQuery(
    ['ride', id],
    () => ridesAPI.getRide(id),
    {
      refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
    }
  );

  const ride = rideData?.data?.ride;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!ride) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Ride not found</h2>
        <p className="text-gray-600 mb-4">The ride you're looking for doesn't exist.</p>
        <Link to="/rides">
          <Button variant="primary">Back to Rides</Button>
        </Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'in_progress': return 'status-in-progress';
      default: return 'status-pending';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ride Details</h1>
          <p className="text-gray-600">View detailed information about your ride</p>
        </div>
        <Link to="/rides">
          <Button variant="secondary">Back to Rides</Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Ride Status</h2>
              <span className={`status-badge ${getStatusColor(ride.status)}`}>
                {ride.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <CalendarIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Scheduled Date</p>
                  <p className="text-sm text-gray-600">
                    {new Date(ride.scheduleTime).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <ClockIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Scheduled Time</p>
                  <p className="text-sm text-gray-600">
                    {new Date(ride.scheduleTime).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Pickup Location</p>
                  <p className="text-sm text-gray-600">{ride.pickup}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Drop Location</p>
                  <p className="text-sm text-gray-600">{ride.drop}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Fare Details */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fare Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Estimated Fare</p>
                  <p className="text-lg font-bold text-gray-900">₹{ride.estimatedFare || 0}</p>
                </div>
              </div>
              
              {ride.actualFare && (
                <div className="flex items-center space-x-3">
                  <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Actual Fare</p>
                    <p className="text-lg font-bold text-gray-900">₹{ride.actualFare}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
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
              {ride.status === 'pending' && (
                <>
                  <Button variant="outline" fullWidth>
                    Edit Ride
                  </Button>
                  <Button variant="danger" fullWidth>
                    Cancel Ride
                  </Button>
                </>
              )}
              
              {ride.status === 'approved' && (
                <Button variant="primary" fullWidth>
                  Track Ride
                </Button>
              )}
              
              <Link to="/rides">
                <Button variant="secondary" fullWidth>
                  Back to Rides
                </Button>
              </Link>
            </div>
          </div>

          {/* Driver Info */}
          {ride.driver && (
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Driver Information</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Driver Name</p>
                    <p className="text-sm text-gray-600">{ride.driver.name}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <TruckIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Vehicle</p>
                    <p className="text-sm text-gray-600">{ride.driver.vehicle}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="h-5 w-5 text-gray-400">⭐</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rating</p>
                    <p className="text-sm text-gray-600">{ride.driver.rating}/5</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ride History */}
          <div className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ride History</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created</span>
                <span className="text-gray-900">
                  {new Date(ride.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {ride.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Approved</span>
                  <span className="text-gray-900">
                    {new Date(ride.approvedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {ride.rejectedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Rejected</span>
                  <span className="text-gray-900">
                    {new Date(ride.rejectedAt).toLocaleDateString()}
                  </span>
                </div>
              )}
              
              {ride.cancelledAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Cancelled</span>
                  <span className="text-gray-900">
                    {new Date(ride.cancelledAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RideDetailsPage; 