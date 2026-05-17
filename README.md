# AI Smart Todo & Productivity Web App

A production-ready MERN stack application with AI-powered task management, featuring smart subtask generation using Google Gemini API, Pomodoro timer, and comprehensive productivity tracking.

## 🚀 Features

### Authentication System
- User registration and login
- JWT-based authentication
- Protected routes
- Password hashing with bcrypt
- Auto-logout on token expiration

### Task Management
- Create, update, delete tasks
- Mark tasks as complete/incomplete
- Priority levels (Low, Medium, High)
- Deadline support with overdue indicators
- Advanced filtering and search
- Subtask management

### AI Features
- **Smart Subtask Generation**: Use Google Gemini API to break down complex tasks into smaller, actionable steps
- AI-powered suggestions for task breakdown
- Fallback mechanisms for reliable operation

### Dashboard & Analytics
- Real-time task statistics
- Interactive charts (Pie charts, Bar charts, Line charts)
- Task completion trends
- Priority distribution analysis
- Weekly activity tracking

### Pomodoro Timer
- 25-minute focus sessions
- 5-minute break periods
- Audio notifications
- Session tracking
- Skip and reset functionality

### UI/UX Features
- Modern, responsive design with Tailwind CSS
- Dark mode toggle with system preference detection
- Toast notifications for user feedback
- Loading spinners and smooth animations
- Mobile-first responsive design
- Accessibility-focused components

## 🛠 Tech Stack

### Frontend
- **React 18** with modern hooks
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Recharts** for data visualization
- **Heroicons** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Google Gemini API** for AI features
- **CORS** for cross-origin requests
- **dotenv** for environment management

## 📁 Project Structure

```
AI_TODO App/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── taskController.js    # Task CRUD operations
│   │   └── aiController.js      # AI subtask generation
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication middleware
│   │   └── errorHandler.js      # Error handling middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Task.js              # Task schema
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── tasks.js             # Task management routes
│   │   └── ai.js                # AI features routes
│   ├── .env                     # Environment variables
│   ├── .env.example             # Environment variables template
│   ├── index.js                 # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx       # Main app layout
│   │   │   ├── TaskCard.jsx     # Task display component
│   │   │   └── TaskModal.jsx    # Task creation/edit modal
│   │   ├── context/
│   │   │   ├── AuthContext.js   # Authentication context
│   │   │   └── ThemeContext.js  # Dark mode context
│   │   ├── hooks/
│   │   │   └── useToast.js      # Toast notification hook
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── Tasks.jsx        # Task management
│   │   │   ├── Statistics.jsx   # Analytics page
│   │   │   └── Pomodoro.jsx     # Pomodoro timer
│   │   ├── utils/
│   │   │   └── api.js           # API utilities
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # App entry point
│   │   └── index.css            # Tailwind CSS imports
│   ├── .env                     # Environment variables
│   ├── .env.example             # Environment variables template
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── postcss.config.js        # PostCSS configuration
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn**
- **Google Gemini API Key** (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AI_TODO_App
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   **Backend Environment Variables:**
   ```bash
   cd backend
   cp .env.example .env
   ```
   
   Edit the `.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ai_todo_app
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

   **Frontend Environment Variables:**
   ```bash
   cd ../frontend
   cp .env.example .env
   ```
   
   Edit the `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Getting Google Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the API key and add it to your backend `.env` file

### Running the Application

1. **Start MongoDB**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: Ensure your connection string is in `.env`

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

4. **Access the Application**
   - Open your browser and navigate to `http://localhost:5173`
   - Register a new account or login
   - Start managing your tasks with AI assistance!

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Tasks
- `GET /api/tasks` - Get all user tasks (with filtering)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/stats` - Get task statistics

### AI Features
- `POST /api/ai/generate-subtasks` - Generate AI subtasks

### Query Parameters for Tasks
- `status`: Filter by status (`pending`, `completed`, `all`)
- `priority`: Filter by priority (`low`, `medium`, `high`, `all`)
- `search`: Search in title and description

## 🎯 Usage Guide

### Creating Tasks
1. Navigate to the Tasks page
2. Click "Add Task" button
3. Fill in task details (title, description, priority, deadline)
4. Optionally add subtasks manually
5. Click "Create Task"

### Using AI Subtask Generation
1. Create or edit a task
2. Click the sparkle (✨) icon on any task
3. AI will automatically generate 3-7 subtasks
4. Review and save the generated subtasks

### Managing Tasks
- **Complete Task**: Click the checkmark icon
- **Edit Task**: Click the pencil icon
- **Delete Task**: Click the trash icon
- **Toggle Subtasks**: Click the chevron to expand/collapse

### Pomodoro Timer
1. Navigate to the Pomodoro page
2. Click "Start" to begin a 25-minute work session
3. Take a 5-minute break when the session ends
4. Enable/disable sound notifications as needed

### Viewing Statistics
1. Navigate to the Statistics page
2. View charts and analytics
3. Filter by time range (week, month, year, all time)
4. Track your productivity trends

## 🔧 Configuration

### Tailwind CSS Customization
Edit `frontend/tailwind.config.js` to customize:
- Color schemes
- Fonts
- Breakpoints
- Animations

### MongoDB Connection
For production, update the `MONGODB_URI` in your backend `.env`:
- Local MongoDB: `mongodb://localhost:27017/ai_todo_app`
- MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/ai_todo_app`

### JWT Configuration
- Change `JWT_SECRET` in production for security
- Default token expiration: 30 days
- Can be customized in `backend/controllers/authController.js`

## 🚀 Deployment

### Backend Deployment (Example: Heroku)
```bash
# Install Heroku CLI
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_production_mongodb_uri
heroku config:set JWT_SECRET=your_production_jwt_secret
heroku config:set GEMINI_API_KEY=your_gemini_api_key

# Deploy
git push heroku main
```

### Frontend Deployment (Example: Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Build and deploy
cd frontend
vercel --prod
```

### Environment Variables for Production
- Backend: Set all environment variables in your hosting platform
- Frontend: Update `VITE_API_URL` to point to your production backend

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **CORS Issues**
   - Ensure frontend URL is in CORS whitelist
   - Check `backend/index.js` CORS configuration

3. **JWT Token Issues**
   - Clear browser localStorage
   - Check JWT_SECRET in backend `.env`
   - Verify token expiration

4. **AI Features Not Working**
   - Verify Gemini API key is valid
   - Check API quota limits
   - Ensure network connectivity to Google services

5. **Build Errors**
   - Run `npm install` in both frontend and backend
   - Check Node.js version compatibility
   - Clear node_modules and reinstall if needed

### Development Tips
- Use browser DevTools to debug API calls
- Check Network tab for failed requests
- Use console.log statements for debugging
- Test with different user roles and permissions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Google Gemini API** for AI-powered features
- **Tailwind CSS** for beautiful UI components
- **Heroicons** for amazing icons
- **React Hot Toast** for elegant notifications
- **Recharts** for interactive charts

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Include error messages and screenshots if applicable

---

**Happy Productivity! 🚀**
