import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  UsersIcon,
  TruckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const AdminDashboardPage = () => {
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: () => adminAPI.getAnalytics(),
    refetchInterval: 60000, // Refetch every minute
    retry: 2,
    staleTime: 30000, // Consider data stale after 30 seconds
  });

  const { data: ridesData, isLoading: ridesLoading } = useQuery({
    queryKey: ['adminRides', { status: 'pending', limit: 5 }],
    queryFn: () => adminAPI.getAllRides({ status: 'pending', limit: 5 }),
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
    staleTime: 15000, // Consider data stale after 15 seconds
  });

  const { data: recentActivityData, isLoading: activityLoading } = useQuery({
    queryKey: ['adminRecentActivity'],
    queryFn: () => adminAPI.getRecentActivity(10),
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
    staleTime: 15000, // Consider data stale after 15 seconds
  });

  const analytics = analyticsData?.data || {};
  const pendingRides = ridesData?.data?.rides || [];
  const recentActivities = recentActivityData?.data?.activities || [];

  // Helper function to get icon for activity type
  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case 'check-circle':
        return CheckCircleIcon;
      case 'x-circle':
        return ExclamationTriangleIcon;
      case 'clock':
        return ClockIcon;
      case 'truck':
        return TruckIcon;
      case 'user':
      case 'user-plus':
      case 'user-minus':
        return UsersIcon;
      default:
        return ClockIcon;
    }
  };

  // Helper function to get icon color for activity type
  const getActivityIconColor = (activityType) => {
    if (activityType.includes('approved') || activityType.includes('completed')) {
      return 'bg-success-100 text-success-600';
    } else if (activityType.includes('rejected') || activityType.includes('delete')) {
      return 'bg-error-100 text-error-600';
    } else if (activityType.includes('pending') || activityType.includes('request')) {
      return 'bg-warning-100 text-warning-600';
    } else {
      return 'bg-yellow-100 text-black';
    }
  };

  // Helper function to format relative time
  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  // Activity Item Component
  const ActivityItem = ({ activity }) => {
    const IconComponent = getActivityIcon(activity.icon);
    const iconColorClass = getActivityIconColor(activity.type);
    
    return (
      <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColorClass}`}>
          <IconComponent className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.description}</p>
          {activity.data?.destination && (
            <p className="text-xs text-gray-500">
              → {activity.data.destination}
            </p>
          )}
        </div>
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {getRelativeTime(activity.timestamp)}
        </span>
      </div>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color, change, changeType }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
            <Icon className={`h-6 w-6 ${color.replace('border-l-', 'text-')}`} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            {change && (
              <p className={`text-xs mt-1 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                {changeType === 'positive' ? '↗' : '↘'} {change}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const PendingRideCard = ({ ride }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Status Badge */}
          <div className="flex items-center space-x-2">
            <ClockIcon className="h-4 w-4 text-warning-500" />
            <span className="status-badge status-pending">Pending</span>
          </div>
          
          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-sm font-medium text-gray-900">
                {ride.userId?.firstName} {ride.userId?.lastName}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {ride.userId?.department}
              </span>
            </div>
            
            {/* Route Info */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">From:</span> {ride.pickup}
              <span className="mx-2">→</span>
              <span className="font-medium">To:</span> {ride.drop}
            </div>
          </div>
        </div>

        {/* Date and Actions */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {new Date(ride.scheduleTime).toLocaleDateString()}
          </span>
          
          <div className="text-sm font-medium text-gray-900">
            ₹{ride.estimatedFare || 0}
          </div>
          
          <div className="flex space-x-2">
            <Link
              to={`/admin/rides`}
              className="text-xs bg-success-100 text-success-700 px-3 py-1 rounded-md hover:bg-success-200 transition-colors"
            >
              Approve
            </Link>
            <Link
              to={`/admin/rides`}
              className="text-xs bg-error-100 text-error-700 px-3 py-1 rounded-md hover:bg-error-200 transition-colors"
            >
              Reject
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Show error state for analytics
  if (analyticsError) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6 text-white"
          style={{ background: 'linear-gradient(to right, #FFD700, #F5C500)' }}
        >
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-black text-opacity-80">
            Monitor and manage corporate ride bookings
          </p>
        </motion.div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />
            <div>
              <h3 className="text-lg font-medium text-red-900">Error Loading Dashboard</h3>
              <p className="text-red-700 mt-1">
                {analyticsError.message || 'Failed to load dashboard data. Please try again.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (analyticsLoading || ridesLoading) {
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl p-6 text-white"
          style={{ background: 'linear-gradient(to right, #FFD700, #F5C500)' }}
        >
          <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
          <p className="text-black text-opacity-80">
            Monitor and manage corporate ride bookings
          </p>
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
        className="rounded-xl p-6 text-white"
        style={{ background: 'linear-gradient(to right, #FFD700, #F5C500)' }}
      >
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-black text-opacity-80">
          Monitor and manage corporate ride bookings
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-4"
      >
        <Link to="/admin/rides">
          <button className="bg-white hover:bg-gray-50 px-4 py-2 rounded-lg shadow-soft border border-gray-200 flex items-center space-x-2 transition-colors">
            <TruckIcon className="h-5 w-5" style={{ color: '#FFD700' }} />
            <span className="text-gray-700">Manage Rides</span>
          </button>
        </Link>
        <Link to="/admin/analytics">
          <button className="bg-white hover:bg-gray-50 px-4 py-2 rounded-lg shadow-soft border border-gray-200 flex items-center space-x-2 transition-colors">
            <ChartBarIcon className="h-5 w-5" style={{ color: '#FFD700' }} />
            <span className="text-gray-700">View Analytics</span>
          </button>
        </Link>
        <Link to="/admin/users">
          <button className="bg-white hover:bg-gray-50 px-4 py-2 rounded-lg shadow-soft border border-gray-200 flex items-center space-x-2 transition-colors">
            <UsersIcon className="h-5 w-5" style={{ color: '#FFD700' }} />
            <span className="text-gray-700">Manage Users</span>
          </button>
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
          value={analytics.summary?.totalRides || 0}
          icon={TruckIcon}
          color="text-black px-2 py-1 rounded-full text-xs font-medium bg-yellow-100"
        />
        <StatCard
          title="Pending Approvals"
          value={analytics.summary?.pendingRides || 0}
          icon={ClockIcon}
          color="bg-orange-100 text-orange-600"
        />
        <StatCard
          title="Approved Rides"
          value={analytics.summary?.approvedRides || 0}
          icon={CheckCircleIcon}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Total Users"
          value={analytics.summary?.totalUsers || 0}
          icon={UsersIcon}
          color="bg-purple-100 text-purple-600"
        />
      </motion.div>

      {/* Pending Approvals */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Pending Approvals</h2>
          <Link
            to="/admin/rides"
            className="text-sm font-medium"
            style={{ color: '#FFD700' }}
            onMouseEnter={(e) => e.target.style.color = '#F5C500'}
            onMouseLeave={(e) => e.target.style.color = '#FFD700'}
          >
            View All
          </Link>
        </div>

        {pendingRides.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircleIcon className="h-12 w-12 text-success-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
            <p className="text-gray-500">No pending ride approvals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRides.map((ride) => (
              <PendingRideCard key={ride._id} ride={ride} />
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent Activity - Latest 5 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          {recentActivities.length > 5 && (
            <Link
              to="/admin/activity"
              className="text-sm font-medium"
              style={{ color: '#FFD700' }}
              onMouseEnter={(e) => e.target.style.color = '#F5C500'}
              onMouseLeave={(e) => e.target.style.color = '#FFD700'}
            >
              View All ({recentActivities.length})
            </Link>
          )}
        </div>
        
        {activityLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : recentActivities.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.slice(0, 5).map((activity) => (
              <ActivityItem key={activity.id} activity={activity} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage; 