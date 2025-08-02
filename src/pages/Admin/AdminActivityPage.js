import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ClockIcon,
  CheckCircleIcon,
  UsersIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import { adminAPI } from '../../services/api';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const AdminActivityPage = () => {
  const { data: recentActivityData, isLoading: activityLoading } = useQuery({
    queryKey: ['adminRecentActivity', 50], // Get more activities for the full page
    queryFn: () => adminAPI.getRecentActivity(50),
    refetchInterval: 30000,
    retry: 2,
    staleTime: 15000,
  });

  const recentActivities = recentActivityData?.data?.activities || [];

  // Helper function to get icon for activity type
  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case 'check-circle':
        return CheckCircleIcon;
      case 'x-circle':
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

  // Helper function to format full date
  const getFullDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Activity Item Component
  const ActivityItem = ({ activity, showFullDate = false }) => {
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
          {showFullDate && (
            <p className="text-xs text-gray-400 mt-1">
              {getFullDate(activity.timestamp)}
            </p>
          )}
        </div>
        {!showFullDate && (
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {getRelativeTime(activity.timestamp)}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-6 text-white"
        style={{ background: 'linear-gradient(to right, #FFD700, #F5C500)' }}
      >
        <h1 className="text-2xl font-bold mb-2">Activity Log</h1>
        <p className="text-black text-opacity-80">
          Complete history of system activities and admin actions
        </p>
      </motion.div>

      {/* Activity List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-soft p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            All Activities
            {recentActivities.length > 0 && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({recentActivities.length} total)
              </span>
            )}
          </h2>
        </div>
        
        {activityLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : recentActivities.length === 0 ? (
          <div className="text-center py-12">
            <ClockIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Found</h3>
            <p className="text-gray-500">No activities have been recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <ActivityItem key={activity.id} activity={activity} showFullDate={true} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminActivityPage;
