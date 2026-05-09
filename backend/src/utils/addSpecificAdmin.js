import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const addAdmin = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env file');
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB...');

    const email = "mrnibras33@gmail.com".trim().toLowerCase();
    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log(`Admin with email ${email} already exists.`);
// Inside your LoginPage.tsx or RegisterPage.tsx component's render method

// ... existing form fields ...

<div className="flex items-center justify-center my-4">
  <div className="border-b border-gray-300 w-1/4"></div>
  <span className="mx-2 text-gray-500 text-sm">OR</span>
  <div className="border-b border-gray-300 w-1/4"></div>
</div>

<button
  type="button" // Important to prevent form submission
  onClick={handleGoogleLogin}
  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
>
  <img src="/path/to/google-icon.svg" alt="Google" className="h-5 w-5 mr-2" />
  Continue with Google
</button>

// ... rest of your component ...
const handleGoogleLogin = () => {
  // Redirect to your backend's Google OAuth initiation endpoint
  window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`;
};
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { authAPI } from '../../services/api'; // Assuming you have an authAPI

// Wrap your App or the specific page with GoogleOAuthProvider
// <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
//   <LoginPage />
// </GoogleOAuthProvider>

const handleGoogleLogin = useGoogleLogin({
  onSuccess: async (tokenResponse) => {
    try {
      // Send the access token to your backend
      const res = await authAPI.googleLogin({ token: tokenResponse.access_token });
      // Handle successful login/registration, e.g., store token, redirect
      console.log('Google login successful:', res.data);
      // Assuming your login context handles the user data and token
      login(res.data);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Backend Google login failed:', error);
      // Display error message to user
    }
  },
  onError: (error) => console.log('Google login failed:', error),
});

// ... in your JSX ...
<button onClick={() => handleGoogleLogin()}>
  Continue with Google
</button>
// src/services/api.ts (conceptual addition)

// ... existing authAPI methods ...

googleLogin: (data: { token: string }) => axios.post(`${API_URL}/auth/google`, data),
      await mongoose.disconnect();
      process.exit(0);
    }

    await User.create({
      name: "Mohammed Ahmed",
      email: email,
      password: "ramesh11",
      role: "admin"
    });

    console.log('✅ Success: Admin "Mohammed Ahmed" has been added to the database.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding admin:', error.message);
    if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
    process.exit(1);
  }
};

addAdmin();