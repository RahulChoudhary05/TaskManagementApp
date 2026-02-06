# Frontend - Task Management App

This is the frontend of the Task Management App built with Next.js, Tailwind CSS, and Firebase.

## Folder Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── auth/
│   │   │   ├── login/     # Login page
│   │   │   └── signup/    # Signup page
│   │   ├── dashboard/     # Main dashboard page
│   │   ├── globals.css    # Global styles
│   │   ├── layout.js      # Root layout
│   │   └── page.js        # Home page
│   │
│   ├── components/        # React components
│   │   ├── Auth/          # Authentication components
│   │   ├── Layout/        # Layout components
│   │   ├── Task/          # Task-related components
│   │   └── UI/            # Reusable UI components
│   │
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Firebase service layer
│   └── utils/             # Helper functions
│
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Getting Started

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the frontend root:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Key Components

### Authentication Components

- **LoginForm** (`components/Auth/LoginForm.js`) - Email/password login
- **SignupForm** (`components/Auth/SignupForm.js`) - User registration

### Task Components

- **TaskCard** (`components/Task/TaskCard.js`) - Individual task display
- **TaskForm** (`components/Task/TaskForm.js`) - Create/edit task form
- **TaskList** (`components/Task/TaskList.js`) - List of tasks with loading states
- **TaskFilters** (`components/Task/TaskFilters.js`) - Filter and sort controls

### Layout Components

- **Navbar** (`components/Layout/Navbar.js`) - Top navigation bar
- **ProtectedRoute** (`components/Layout/ProtectedRoute.js`) - Route protection wrapper

### UI Components

- **Modal** (`components/UI/Modal.js`) - Reusable modal dialog
- **Button** (`components/UI/Button.js`) - Reusable button component

## Custom Hooks

### useAuth

Handles authentication operations:

```javascript
const { register, login, logout, loading, error } = useAuth();
```

### useTasks

Manages task CRUD operations:

```javascript
const { 
  tasks, 
  loading, 
  error, 
  fetchTasks, 
  addTask, 
  editTask, 
  removeTask, 
  changeTaskStatus 
} = useTasks(userId);
```

## Context

### AuthContext

Provides global authentication state:

```javascript
const { user, loading, isAuthenticated } = useAuth();
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with login/signup links |
| `/auth/login` | Login page |
| `/auth/signup` | Registration page |
| `/dashboard` | Main task management dashboard |

## Features

### Authentication
- Email/password signup and login
- Protected routes
- Automatic redirect based on auth state

### Task Management
- Create, read, update, delete tasks
- Task status: Todo, In Progress, Done
- Due date tracking
- Overdue task indicators

### Filtering & Sorting
- Filter by status (All, Todo, In Progress, Done)
- Sort by due date or creation date
- Ascending/descending order toggle

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Loading states and skeletons
- Error handling with user-friendly messages
- Smooth animations and transitions
- Clean, modern interface with Tailwind CSS

## Styling

This project uses Tailwind CSS for styling. Key configuration:

- **Primary color**: Blue (#3b82f6)
- **Font**: Inter (Google Fonts)
- **Custom animations**: fade-in, slide-in
- **Custom scrollbar**: Styled for better UX

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID |

## Notes

- All Firebase config values are public and safe to expose client-side
- Authentication state persists across page refreshes
- Tasks are automatically linked to the authenticated user
- Real-time updates can be added by using Firestore listeners
