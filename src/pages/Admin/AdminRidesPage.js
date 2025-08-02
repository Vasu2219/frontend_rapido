import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { adminAPI } from '../../services/api';
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { useDebounce } from '../../hooks/useDebounce';

const AdminRidesPage = () => {
  const [filters, setFilters] = useState({
    status: '',
    department: '',
    startDate: '',
    endDate: '',
    page: 1,
    limit: 10,
  });

  // Debounce filters to prevent excessive API calls
  const debouncedFilters = useDebounce(filters, 500);

  const { data: ridesData, isLoading, error, refetch } = useQuery({
    queryKey: ['adminRides', debouncedFilters],
    queryFn: () => adminAPI.getAllRides(debouncedFilters),
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    retry: 2,
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  const rides = ridesData?.data?.rides || [];
  const pagination = ridesData?.data?.pagination || {};

  // Memoized filter handlers to prevent unnecessary re-renders
  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      status: '',
      department: '',
      startDate: '',
      endDate: '',
      page: 1,
      limit: 10,
    });
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
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

  const handleRideAction = async (rideId, action) => {
    try {
      if (action === 'approve') {
        await adminAPI.approveRide(rideId);
      } else if (action === 'reject') {
        await adminAPI.rejectRide(rideId);
      }
      refetch(); // Refresh the data
    } catch (error) {
      console.error(`Failed to ${action} ride:`, error);
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
            <h1 className="text-2xl font-bold text-gray-900">All Rides</h1>
            <p className="text-gray-600">Manage and approve corporate ride bookings</p>
          </div>
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
            <h1 className="text-2xl font-bold text-gray-900">All Rides</h1>
            <p className="text-gray-600">Manage and approve corporate ride bookings</p>
          </div>
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
          <h1 className="text-2xl font-bold text-gray-900">All Rides</h1>
          <p className="text-gray-600">Manage and approve corporate ride bookings</p>
        </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rapido-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
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
              <span>Showing {rides.length} of {pagination.total || 0} rides</span>
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
              {Object.values(filters).some(val => val && val !== '1' && val !== '10') 
                ? 'Try adjusting your filters' 
                : 'No rides available at the moment'
              }
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fare
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rides.map((ride, index) => (
                  <motion.tr
                    key={ride._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    {/* Date & Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">
                        {new Date(ride.scheduleTime).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                      <div className="mt-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                          {getStatusIcon(ride.status)}
                          <span className="ml-1 capitalize">{ride.status.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </td>

                    {/* Employee */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {ride.userId?.firstName} {ride.userId?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {ride.userId?.department}
                      </div>
                    </td>

                    {/* Route */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center mb-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="font-medium">From:</span>
                          <span className="ml-1 truncate max-w-[200px]">{ride.pickup}</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          <span className="font-medium">To:</span>
                          <span className="ml-1 truncate max-w-[200px]">{ride.drop}</span>
                        </div>
                      </div>
                    </td>

                    {/* Fare */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-lg font-bold text-gray-900">
                        ₹{ride.estimatedFare || 0}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {ride.status === 'pending' ? (
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() => handleRideAction(ride._id, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRideAction(ride._id, 'reject')}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No actions</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center space-x-2"
        >
          <Button
            variant="outline"
            disabled={pagination.page <= 1}
            onClick={() => handlePageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          
          <Button
            variant="outline"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => handlePageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default AdminRidesPage; 