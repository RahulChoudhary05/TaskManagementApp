# Backend - Firebase Setup

This folder contains all Firebase-related configuration and helper functions.

## Folder Structure

```
backend/
├── firebase/
│   ├── config/       # Firebase initialization
│   ├── auth/         # Authentication helpers
│   ├── db/           # Firestore database operations
│   └── utils/        # Common helper functions
├── env/              # Environment variable examples
└── README.md
```

## Firebase Setup Instructions

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional but recommended)

### Step 2: Enable Authentication

1. In Firebase Console, go to "Build" > "Authentication"
2. Click "Get started"
3. Enable "Email/Password" provider
4. Save the configuration

### Step 3: Create Firestore Database

1. Go to "Build" > "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to your users
5. Click "Enable"

### Step 4: Get Firebase Config

1. Go to Project Settings (gear icon)
2. Under "Your apps", click the web icon (</>)
3. Register your app with a nickname
4. Copy the Firebase configuration object

### Step 5: Set Up Environment Variables

1. Copy `backend/env/.env.example` to frontend root as `.env.local`
2. Fill in your Firebase configuration values:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### Step 6: Firestore Security Rules

Add these security rules to protect user data:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write only their own tasks
    match /tasks/{taskId} {
      allow create: if request.auth != null 
                    && request.resource.data.userId == request.auth.uid;
      allow read, update, delete: if request.auth != null 
                                   && resource.data.userId == request.auth.uid;
    }
  }
}
```

To set up rules:
1. Go to Firestore Database > Rules
2. Paste the rules above
3. Click "Publish"

## Database Structure

### Tasks Collection

```
tasks/{taskId}
├── title: string
├── description: string
├── dueDate: timestamp
├── status: string ('todo', 'in-progress', 'done')
├── userId: string (owner's UID)
├── createdAt: timestamp
└── updatedAt: timestamp
```

## Available Functions

### Authentication (`firebase/auth/auth.js`)

- `signUp(email, password, displayName)` - Create new account
- `signIn(email, password)` - Sign in existing user
- `logOut()` - Sign out current user
- `getCurrentUser()` - Get current user object
- `onAuthChange(callback)` - Listen to auth state changes

### Database (`firebase/db/tasks.js`)

- `createTask(taskData, userId)` - Create a new task
- `getUserTasks(userId, filters)` - Get all tasks for a user
- `getTaskById(taskId)` - Get a single task
- `updateTask(taskId, updateData)` - Update a task
- `deleteTask(taskId)` - Delete a task
- `updateTaskStatus(taskId, status)` - Update task status

### Utils (`firebase/utils/helpers.js`)

- `formatDate(date)` - Format date for display
- `isOverdue(dueDate)` - Check if task is overdue
- `getStatusColor(status)` - Get status color class
- `getStatusLabel(status)` - Get status display label
- `sortTasksByDueDate(tasks, order)` - Sort tasks by date
- `filterTasksByStatus(tasks, status)` - Filter tasks by status
- `validateTaskData(taskData)` - Validate task form data

## Notes

- All Firebase operations are asynchronous and return promises
- Error handling is built into all functions
- User authentication is required for all database operations
- Tasks are automatically linked to users via `userId` field
