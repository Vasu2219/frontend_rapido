# Rapido Corporate Frontend

A professional, modern React frontend for the Rapido Corporate Ride Scheduling System. Built with cutting-edge technologies and best practices to deliver an exceptional user experience.

## 🚀 Features

### Core Features
- **User Authentication & Authorization** with JWT tokens
- **Role-based Access Control** (User/Admin)
- **Real-time Ride Management** with live status updates
- **Advanced Booking System** with fare estimation
- **Comprehensive Admin Dashboard** with analytics
- **Responsive Design** for all devices

### Technical Features
- **Modern React 19** with hooks and functional components
- **Tailwind CSS** for beautiful, responsive styling
- **Framer Motion** for smooth animations
- **React Query** for efficient data fetching and caching
- **React Hook Form** for form validation
- **React Router** for client-side routing
- **Toast Notifications** for user feedback
- **Real-time Updates** with automatic refetching

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **React Query** - Powerful data synchronization
- **React Hook Form** - Performant forms with validation
- **React Router v6** - Declarative routing
- **Axios** - HTTP client for API calls
- **Recharts** - Composable charting library
- **Heroicons** - Beautiful hand-crafted SVG icons
- **React Hot Toast** - Elegant notifications

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── UI/            # Basic UI components (Button, Input, etc.)
│   └── Layout/        # Layout components
├── contexts/           # React contexts for state management
├── pages/             # Page components
│   ├── Auth/          # Authentication pages
│   ├── Dashboard/     # Dashboard pages
│   ├── Rides/         # Ride management pages
│   ├── Profile/       # User profile pages
│   └── Admin/         # Admin pages
├── services/          # API services and utilities
└── index.js           # Application entry point
```

## 🎨 Design System

### Color Palette
- **Primary**: Rapido Blue (`#0ea5e9`)
- **Success**: Green (`#22c55e`)
- **Warning**: Orange (`#f59e0b`)
- **Error**: Red (`#ef4444`)
- **Neutral**: Gray scale

### Components
- **Cards**: Consistent shadow and border radius
- **Buttons**: Multiple variants (primary, secondary, danger, etc.)
- **Status Badges**: Color-coded for different states
- **Animations**: Smooth transitions and micro-interactions

## 🔐 Authentication

The application uses JWT-based authentication with the following features:

- **Automatic Token Management**: Tokens are stored in localStorage
- **Route Protection**: Protected routes redirect to login
- **Role-based Access**: Different views for users and admins
- **Auto-refresh**: Automatic token refresh and logout on expiry

### Demo Credentials
- **Employee**: `employee@company.com` / `password123`
- **Admin**: `admin@company.com` / `admin123`

## 📱 Pages & Features

### User Pages
1. **Login/Register** - Authentication pages with form validation
2. **Dashboard** - Overview with ride statistics and recent rides
3. **Book Ride** - Advanced booking form with fare estimation
4. **My Rides** - Ride listing with filtering and real-time updates
5. **Ride Details** - Comprehensive ride information and actions
6. **Profile** - User profile management and settings

### Admin Pages
1. **Admin Dashboard** - Analytics overview and pending approvals
2. **All Rides** - Complete ride management with filtering
3. **Analytics** - Comprehensive charts and reports
4. **User Management** - User administration and account management

## 🔄 Real-time Features

- **Live Status Updates**: Ride status changes are reflected immediately
- **Auto-refresh**: Data is automatically refreshed every 30 seconds
- **Toast Notifications**: Real-time feedback for all actions
- **Optimistic Updates**: UI updates immediately for better UX

## 📊 Analytics & Charts

The admin dashboard includes comprehensive analytics:

- **Status Distribution**: Pie chart showing ride status breakdown
- **Department Analytics**: Bar chart of rides by department
- **Monthly Trends**: Area chart showing ride trends over time
- **Key Metrics**: Total rides, pending approvals, revenue, etc.

## 🎯 Key Features

### For Users
- **Smart Booking**: Advanced form with fare estimation
- **Quick Actions**: Popular locations and time presets
- **Real-time Tracking**: Live status updates
- **Filtering**: Advanced filtering by status, date, etc.

### For Admins
- **Approval Workflow**: Easy approve/reject actions
- **Comprehensive Analytics**: Detailed insights and reports
- **User Management**: Full user administration
- **Advanced Filtering**: Multi-criteria filtering and search

## 🚀 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **React Query**: Efficient caching and background updates
- **Optimized Images**: WebP format with proper sizing
- **Lazy Loading**: Components loaded on demand
- **Memoization**: Strategic use of React.memo and useMemo

## 🔧 Development

### Available Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

### Code Quality
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **TypeScript**: Type safety (optional)
- **Component Testing**: Unit tests for components

## 🌐 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layouts
- **Mobile**: Touch-friendly interface

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Route Protection**: Protected routes with role-based access
- **Input Validation**: Comprehensive form validation
- **XSS Protection**: Sanitized inputs and outputs
- **CSRF Protection**: Built-in CSRF protection

## 🎨 Customization

### Theming
The application uses Tailwind CSS with a custom design system. Colors and styles can be easily customized in `tailwind.config.js`.

### Components
All components are built to be reusable and customizable. Check the `components/` directory for examples.

## 📈 Monitoring & Analytics

- **Error Tracking**: Automatic error reporting
- **Performance Monitoring**: Core Web Vitals tracking
- **User Analytics**: Usage patterns and behavior
- **Real-time Monitoring**: Live system health checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API documentation
- Contact the development team

---

**Built with ❤️ for Rapido Corporate**
