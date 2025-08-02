import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ridesAPI } from '../../services/api';
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { useDebounce } from '../../hooks/useDebounce';

const RidesPage = () => {
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
  });
  const [deletingRides, setDeletingRides] = useState(new Set());

  // Debounce filters to prevent excessive API calls
  const debouncedFilters = useDebounce(filters, 500);

  const { data: ridesData, isLoading, error, refetch } = useQuery({
    queryKey: ['userRides', debouncedFilters],
    queryFn: () => ridesAPI.getUserRides(debouncedFilters),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    retry: 2,
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  const rides = ridesData?.data?.rides || [];

  // Memoized filter handlers to prevent unnecessary re-renders
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      status: '',
      startDate: '',
      endDate: '',
    });
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': 
        return 'bg-yellow-100 text-yellow-800';
      case 'approved': 
        return 'bg-green-100 text-green-800';
      case 'rejected': 
        return 'bg-red-100 text-red-800';
      case 'completed': 
        return 'bg-blue-100 text-blue-800';
      case 'cancelled': 
        return 'bg-gray-100 text-gray-800';
      case 'in_progress': 
        return 'bg-indigo-100 text-indigo-800';
      default: 
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'rejected':
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleCancelRide = async (rideId, rideStatus) => {
    // Check if ride can be cancelled
    if (['completed', 'cancelled'].includes(rideStatus)) {
      toast.error('This ride cannot be cancelled');
      return;
    }

    const confirmCancel = window.confirm('Are you sure you want to cancel this ride?');
    if (!confirmCancel) return;
    
    // Add ride to deleting set for loading state
    setDeletingRides(prev => new Set([...prev, rideId]));
    
    try {
      await ridesAPI.cancelRide(rideId, 'Cancelled by user');
      await refetch();
      toast.success('Ride cancelled successfully');
    } catch (error) {
      console.error('Failed to cancel ride:', error);
      const errorMessage = error.response?.data?.message || 'Failed to cancel ride. Please try again.';
      toast.error(errorMessage);
    } finally {
      setDeletingRides(prev => {
        const newSet = new Set(prev);
        newSet.delete(rideId);
        return newSet;
      });
    }
  };

  const handleDeleteRide = async (rideId) => {
    const confirmDelete = window.confirm('Are you sure you want to permanently delete this ride? This action cannot be undone.');
    if (!confirmDelete) return;
    
    // Add ride to deleting set for loading state
    setDeletingRides(prev => new Set([...prev, rideId]));
    
    try {
      await ridesAPI.deleteRide(rideId);
      await refetch();
      toast.success('Ride deleted permanently');
    } catch (error) {
      console.error('Failed to delete ride:', error);
      if (error.response?.status === 400) {
        toast.error('Only cancelled rides can be deleted');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to delete ride. Please try again.';
        toast.error(errorMessage);
      }
    } finally {
      setDeletingRides(prev => {
        const newSet = new Set(prev);
        newSet.delete(rideId);
        return newSet;
      });
    }
  };

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Rides</h1>
            <p className="text-gray-600">View and manage your ride bookings</p>
          </div>
          <Link to="/rides/book">
            <Button variant="primary">
              <PlusIcon className="h-4 w-4 mr-2" />
              Book New Ride
            </Button>
          </Link>
        </motion.div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <XCircleIcon className="h-6 w-6 text-red-500" />
            <div>
              <h3 className="text-lg font-medium text-red-900">Error Loading Rides</h3>
              <p className="text-red-700 mt-1">
                {error.message || 'Failed to load rides. Please try again.'}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={() => refetch()} variant="outline">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Rides</h1>
            <p className="text-gray-600">View and manage your ride bookings</p>
          </div>
          <Link to="/rides/book">
            <Button variant="primary">
              <PlusIcon className="h-4 w-4 mr-2" />
              Book New Ride
            </Button>
          </Link>
        </motion.div>

        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Rides</h1>
          <p className="text-gray-600">View and manage your ride bookings</p>
        </div>
        <Link to="/rides/book">
          <Button variant="primary">
            <PlusIcon className="h-4 w-4 mr-2" />
            Book New Ride
          </Button>
        </Link>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <div className="flex items-center space-x-2 mb-4">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rapido-500 focus:border-transparent"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rapido-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rapido-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {rides.length > 0 && (
              <span>Showing {rides.length} rides</span>
            )}
          </div>
          <Button
            variant="secondary"
            onClick={handleClearFilters}
          >
            Clear Filters
          </Button>
        </div>
      </motion.div>

      {/* Rides Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-soft overflow-hidden"
      >
        {rides.length === 0 ? (
          <div className="text-center py-12">
            <TruckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rides found</h3>
            <p className="text-gray-500">
              {Object.values(filters).some(val => val) 
                ? 'Try adjusting your filters' 
                : 'You haven\'t booked any rides yet'
              }
            </p>
            {!Object.values(filters).some(val => val) && (
              <div className="mt-4">
                <Link to="/rides/book">
                  <Button variant="primary">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Book Your First Ride
                  </Button>
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/4">
                    Date & Time / Status
                  </th>
                  <th scope="col" className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-2/4">
                    Route Details
                  </th>
                  <th scope="col" className="px-8 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Estimated Fare
                  </th>
                  <th scope="col" className="px-8 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-1/6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rides.map((ride, index) => (
                  <motion.tr
                    key={ride._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: deletingRides.has(ride._id) ? 0.5 : 1, 
                      x: 0,
                      scale: deletingRides.has(ride._id) ? 0.98 : 1
                    }}
                    transition={{ delay: index * 0.05 }}
                    className={`transition-all duration-300 ${
                      deletingRides.has(ride._id) 
                        ? 'bg-gray-100 pointer-events-none' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Date & Status */}
                    <td className="px-8 py-6 whitespace-nowrap w-1/4">
                      <div className="text-sm text-gray-900 font-medium mb-1">
                        {new Date(ride.scheduleTime).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        {new Date(ride.scheduleTime).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                          {getStatusIcon(ride.status)}
                          <span className="ml-1.5 capitalize">{ride.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </td>

                    {/* Route */}
                    <td className="px-8 py-6 w-2/4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          <span className="font-medium text-gray-600 min-w-[60px]">Pickup:</span>
                          <span className="ml-2 text-gray-900">{ride.pickup}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                          <span className="font-medium text-gray-600 min-w-[60px]">Drop:</span>
                          <span className="ml-2 text-gray-900">{ride.drop}</span>
                        </div>
                      </div>
                    </td>

                    {/* Fare */}
                    <td className="px-8 py-6 whitespace-nowrap w-1/6">
                      <div className="text-xl font-bold text-gray-900">
                        ₹{ride.estimatedFare || 0}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Estimated
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-8 py-6 whitespace-nowrap text-right w-1/6">
                      <div className="flex justify-end space-x-3">
                        {ride.status === 'pending' ? (
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleCancelRide(ride._id, ride.status)}
                            disabled={deletingRides.has(ride._id)}
                          >
                            {deletingRides.has(ride._id) ? 'Cancelling...' : 'Cancel'}
                          </Button>
                        ) : ride.status === 'cancelled' ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteRide(ride._id)}
                            disabled={deletingRides.has(ride._id)}
                          >
                            {deletingRides.has(ride._id) ? 'Removing...' : 'Remove'}
                          </Button>
                        ) : ride.status === 'completed' ? (
                          <span className="text-sm text-gray-400">Cannot delete</span>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCancelRide(ride._id, ride.status)}
                            disabled={deletingRides.has(ride._id)}
                          >
                            {deletingRides.has(ride._id) ? 'Cancelling...' : 'Cancel'}
                          </Button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RidesPage; 