import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  TruckIcon, 
  ClockIcon, 
  ShieldCheckIcon, 
  CurrencyDollarIcon,
  MapPinIcon,
  UserGroupIcon,
  CalendarIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const ServicesPage = () => {
  const services = [
    {
      icon: TruckIcon,
      title: "Daily Office Commute",
      description: "Reliable daily transportation to and from your workplace with scheduled pickup and drop-off times.",
      features: ["Fixed Routes", "Regular Schedule", "Cost Effective", "Comfortable Vehicles"]
    },
    {
      icon: ClockIcon,
      title: "On-Demand Rides",
      description: "Book instant rides for urgent office needs, client meetings, or unexpected travel requirements.",
      features: ["Instant Booking", "24/7 Availability", "Quick Response", "Real-time Tracking"]
    },
    {
      icon: UserGroupIcon,
      title: "Group Transportation",
      description: "Shared rides for teams, departments, or events with larger vehicles for cost-effective travel.",
      features: ["Team Bookings", "Larger Vehicles", "Shared Costs", "Event Transportation"]
    },
    {
      icon: CalendarIcon,
      title: "Scheduled Rides",
      description: "Pre-book your rides for important meetings, appointments, or planned office visits.",
      features: ["Advance Booking", "Meeting Reminders", "Flexible Scheduling", "Confirmed Reservations"]
    }
  ];

  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: "Cost Effective",
      description: "Save money with corporate rates and shared ride options compared to individual transportation."
    },
    {
      icon: ShieldCheckIcon,
      title: "Safe & Secure",
      description: "Professional drivers, vehicle tracking, and corporate safety standards for peace of mind."
    },
    {
      icon: MapPinIcon,
      title: "Wide Coverage",
      description: "Extensive service area covering all major business districts and residential areas."
    },
    {
      icon: PhoneIcon,
      title: "24/7 Support",
      description: "Round-the-clock customer support for booking assistance and emergency situations."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/icon.png" 
                alt="Rapido Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-xl font-bold text-gray-900">Rapido Corporate</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md text-sm font-medium"
                style={{ backgroundColor: '#FFD700' }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-white py-20" style={{ background: 'linear-gradient(to right, #FFD700, #FFA500)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Corporate Transportation
              <br />
              <span className="text-yellow-200">Made Simple</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl mb-8 text-yellow-100 max-w-3xl mx-auto"
            >
              Reliable, safe, and cost-effective transportation solutions for your business needs
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/register"
                className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Start Your Journey
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-yellow-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Employee Login
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive transportation solutions designed for modern businesses and their employees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mr-4" style={{ backgroundColor: '#FFD700' }}>
                    <service.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{service.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <div className="grid grid-cols-2 gap-3">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: '#FFD700' }}></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Rapido?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference with our professional transportation services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FFD700' }}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to get started with Rapido Corporate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Sign Up",
                description: "Create your employee account with company credentials and get verified by your admin."
              },
              {
                step: "2",
                title: "Book a Ride",
                description: "Choose from daily commute, on-demand rides, or scheduled transportation based on your needs."
              },
              {
                step: "3",
                title: "Travel Safely",
                description: "Enjoy reliable, professional transportation with real-time tracking and 24/7 support."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold" style={{ backgroundColor: '#FFD700' }}>
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-white py-16" style={{ backgroundColor: '#FFD700' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Commute?
          </h2>
          <p className="text-xl text-yellow-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who trust Rapido for their daily transportation needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-yellow-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Get Started Today
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white hover:bg-white hover:text-yellow-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Employee Portal
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/assets/icon.png" 
                  alt="Rapido Logo" 
                  className="w-8 h-8 object-contain"
                />
                <span className="text-xl font-bold">Rapido Corporate</span>
              </div>
              <p className="text-gray-400">
                Professional transportation solutions for modern businesses.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Daily Commute</li>
                <li>On-Demand Rides</li>
                <li>Group Transportation</li>
                <li>Scheduled Rides</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Safety Guidelines</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>support@rapido.com</li>
                <li>1-800-RAPIDO</li>
                <li>24/7 Support</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Rapido Corporate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServicesPage;
