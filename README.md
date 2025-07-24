# NXS Notifier - React Native App

A React Native app with Appwrite authentication for mobile number and password login/signup.

## Features

- ✅ User registration with mobile number and password
- ✅ User login with mobile number and password
- ✅ Protected routes (authentication required)
- ✅ Logout functionality
- ✅ Modern UI with proper styling
- ✅ Form validation
- ✅ Loading states

## Setup Instructions

### 1. Appwrite Project Setup

1. Go to [Appwrite Console](https://console.appwrite.io/)
2. Login with your credentials:
   - Email: Tech.workspace.ws@gmail.com
   - Password: Workspace2020$$
3. Create a new project named "nxsnotifier"
4. Get your Project ID from the project settings

### 2. Update Configuration

Update the `appwrite.config.js` file with your actual project ID:

```javascript
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('YOUR_ACTUAL_PROJECT_ID'); // Replace with your project ID
```

### 3. Appwrite Authentication Setup

1. In your Appwrite project, go to "Auth" section
2. Enable "Email/Password" authentication
3. Configure the following settings:
   - Allow registration: Yes
   - Allow login: Yes
   - Email verification: Optional (for mobile number auth)

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the App

```bash
npm start
```

## Project Structure

```
app/
├── _layout.jsx          # Main layout with auth routing
├── index.jsx            # Home page (protected)
└── auth/
    ├── login.jsx        # Login page
    └── signup.jsx       # Signup page
```

## Authentication Flow

1. **App Launch**: Checks if user is authenticated
2. **Not Authenticated**: Redirects to login page
3. **Login/Signup**: User can register or login with mobile number
4. **Success**: Redirects to home page
5. **Logout**: Clears session and returns to login

## Notes

- Mobile numbers are stored as email addresses (e.g., `1234567890@mobile.com`)
- This is a workaround since Appwrite doesn't natively support phone number authentication
- For production, consider implementing proper phone number verification with SMS

## Troubleshooting

- Make sure your Appwrite project ID is correctly set
- Check that email/password authentication is enabled in Appwrite
- Ensure all dependencies are installed
- Check console for any error messages 