import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { ridesAPI } from '../../services/api';
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  CalendarIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [deletingRides, setDeletingRides] = useState(new Set());

  const { data: ridesData, isLoading, refetch } = useQuery({
    queryKey: ['userRides'],
    queryFn: () => ridesAPI.getUserRides(),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const rides = ridesData?.data?.rides || [];
  
  // Calculate statistics from rides
  const stats = {
    total: rides.length,
    pending: rides.filter(ride => ride.status === 'pending').length,
    approved: rides.filter(ride => ride.status === 'approved').length,
    completed: rides.filter(ride => ride.status === 'completed').length,
    cancelled: rides.filter(ride => ride.status === 'cancelled').length,
  };

  const recentRides = rides.slice(0, 5);

  const StatCard = ({ title, value, icon: Icon, color, change }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-soft p-6 border-l-4 ${color}`}
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
          <Icon className="h-6 w-6 text-gray-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className="text-xs text-gray-500">{change}</p>
          )}
        </div>
      </div>
    </motion.div>
  );

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': 
        return 'bg-yellow-100 text-yellow-800';
      case 'approved': 
        return 'bg-green-100 text-green-800';
      case 'rejected': 
        return 'bg-red-100 text-red-800';
      case 'completed': 
        return `text-black px-2 py-1 rounded-full text-xs font-medium ${
               status === 'pending' ? 'bg-yellow-100' :
               status === 'confirmed' ? 'bg-yellow-100 bg-opacity-60' :
               status === 'in-progress' ? 'bg-yellow-100 bg-opacity-40' :
               status === 'completed' ? 'bg-green-100 text-green-800' :
               'bg-red-100 text-red-800'
        }`;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6 text-white"
        style={{ background: 'linear-gradient(to right, #FFD700, #F5C500)' }}
      >
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-rapido-100">
          Manage your corporate rides and track your bookings
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4"
      >
        <Link to="/rides/book">
          <Button variant="primary" className="flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Book New Ride</span>
          </Button>
        </Link>
        <Link to="/rides">
          <Button variant="outline" className="flex items-center space-x-2">
            <TruckIcon className="h-5 w-5" />
            <span>View All Rides</span>
          </Button>
        </Link>
      </motion.div>

      {/* Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Rides"
          value={stats.total}
          icon={TruckIcon}
          color="border-l-4"
          style={{ borderLeftColor: '#FFD700' }}
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={ClockIcon}
          color="border-l-warning-500"
        />
        <StatCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircleIcon}
          color="border-l-success-500"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={CheckCircleIcon}
          color="border-l-4"
          style={{ borderLeftColor: '#FFD700' }}
        />
      </motion.div>

      {/* Recent Rides */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Rides</h2>
          <Link
            to="/rides"
            className="text-sm font-medium"
            style={{ color: '#FFD700' }}
            onMouseEnter={(e) => e.target.style.color = '#F5C500'}
            onMouseLeave={(e) => e.target.style.color = '#FFD700'}
          >
            View All
          </Link>
        </div>

        {recentRides.length === 0 ? (
          <div className="text-center py-8">
            <TruckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No rides yet</h3>
            <p className="text-gray-500 mb-4">Book your first corporate ride to get started</p>
            <Link to="/rides/book">
              <Button variant="primary">Book Your First Ride</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                {recentRides.map((ride, index) => (
                  <motion.tr
                    key={ride._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: deletingRides.has(ride._id) ? 0.5 : 1, 
                      x: 0,
                      scale: deletingRides.has(ride._id) ? 0.98 : 1
                    }}
                    transition={{ delay: index * 0.1 }}
                    className={`transition-all duration-300 ${
                      deletingRides.has(ride._id) 
                        ? 'bg-gray-100 pointer-events-none' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Date & Status */}
                    <td className="py-4 pr-6">
                      <div className="text-sm text-gray-900 font-medium mb-1">
                        {new Date(ride.scheduleTime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                          {getStatusIcon(ride.status)}
                          <span className="ml-1 capitalize">{ride.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </td>

                    {/* Route */}
                    <td className="py-4 pr-6">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="truncate max-w-[180px]">{ride.pickup}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          <span className="truncate max-w-[180px]">{ride.drop}</span>
                        </div>
                      </div>
                    </td>

                    {/* Fare */}
                    <td className="py-4 pr-6">
                      <div className="text-sm font-bold text-gray-900">
                        ₹{ride.estimatedFare || 0}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 text-right">
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
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-blue-50 to-rapido-50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-start space-x-3">
            <CalendarIcon className="h-5 w-5 mt-0.5" style={{ color: '#FFD700' }} />
            <div>
              <p className="font-medium text-gray-900">Book in Advance</p>
              <p>Schedule your rides at least 2 hours in advance for better approval rates</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPinIcon className="h-5 w-5 mt-0.5" style={{ color: '#FFD700' }} />
            <div>
              <p className="font-medium text-gray-900">Clear Pickup/Drop</p>
              <p>Provide detailed addresses and landmarks for smooth rides</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage; 