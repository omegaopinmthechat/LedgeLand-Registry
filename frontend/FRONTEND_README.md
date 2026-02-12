# Frontend Authentication System

## 📁 Project Structure

```
src/
├── api/
│   └── api.js                    # API functions for backend communication
├── app/
│   ├── login/
│   │   └── page.js              # Login page
│   ├── signup/
│   │   └── page.js              # Signup page
│   ├── dashboard/
│   │   └── page.js              # Protected dashboard page
│   ├── layout.js                # Root layout with AuthProvider
│   └── globals.css              # Global styles
├── components/
│   └── ui/
│       ├── AuthLayout.js        # Reusable auth layout with image
│       ├── LoginForm.js         # Login form component
│       └── SignupForm.js        # Signup form component
├── context/
│   └── AuthContext.js           # Authentication context provider
├── hooks/
│   └── useAuth.js               # Custom hooks for login and signup
└── lib/
    └── axios.js                 # Axios instance with interceptors
```

## 🎯 Features

- **Separated Concerns**: Business logic in hooks, UI in components, API calls in api folder
- **Context API**: Global authentication state management
- **Protected Routes**: Dashboard accessible only to authenticated users
- **Axios Interceptors**: Automatic token injection and error handling
- **Production Ready**: Clean code structure with descriptive comments
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.local.example .env.local
   ```
   Update `NEXT_PUBLIC_BACKEND_URL` with your backend URL

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   Navigate to `http://localhost:3000`

## 📝 API Endpoints

- **Login**: `POST /auth/login`
  - Body: `{ email, password }`
  
- **Signup**: `POST /auth/register`
  - Body: `{ email, password, confirm_password }`

## 🔐 Authentication Flow

1. User submits login/signup form
2. Form component calls custom hook (useLogin/useSignup)
3. Hook calls API function from api/api.js
4. API function uses axios instance with interceptors
5. On success, token and user data stored in context and localStorage
6. User redirected to dashboard
7. Protected routes check authentication status

## 📦 Key Files

### API Layer (`src/api/api.js`)
Contains all API functions that communicate with the backend.

### Context (`src/context/AuthContext.js`)
Manages global authentication state and provides login/logout methods.

### Hooks (`src/hooks/useAuth.js`)
Custom hooks containing business logic for login and signup.

### Components (`src/components/ui/`)
Reusable UI components for authentication forms and layouts.

### Pages (`src/app/`)
Next.js 13+ app router pages for login, signup, and dashboard.

## 🎨 Styling

Uses Tailwind CSS for styling with a clean, modern design featuring:
- Left side: Gradient background with welcome message
- Right side: Authentication forms
- Responsive design for mobile devices

## 🔒 Security Features

- JWT tokens stored in localStorage
- Automatic token injection via axios interceptors
- Protected routes with authentication checks
- Automatic redirect on 401 errors
- Password validation on backend

## 📚 Code Standards

- One-line comments above all functions
- Separated business logic and UI
- Consistent naming conventions
- Error handling for all async operations
- Loading states for better UX
